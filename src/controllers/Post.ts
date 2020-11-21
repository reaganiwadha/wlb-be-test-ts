import { ParameterizedContext } from "koa";
import agenda from "../config/agenda";
import { ERR_COMMENT_NOT_FOUND, ERR_CONTENT_NOT_PROVIDED, ERR_FORBIDDEN, ERR_INVALID_BODY, ERR_LIKED_POST_TWICE, ERR_NO_LIKE_FOUND, ERR_PARENT_COMMENT_NOT_FOUND, ERR_PARENT_COMMENT_TOO_NESTED, ERR_POST_NOT_FOUND } from "../consts/errors";
import User from "../sequelizeModels/User";
import UserPost from "../sequelizeModels/UserPost";
import UserPostLike from "../sequelizeModels/UserPostLike";

import { literal, Op } from 'sequelize'
import UserPostComment from "../sequelizeModels/UserPostComment";

export default class PostController{
    private static getPostsBaseQuery = {
        attributes : [
            'id',
            'content',
            'title',
            [literal('(SELECT COUNT(*) FROM "user_post_likes" WHERE "user_post_id" = "UserPost".id)'), 'likes_count'],
            [literal('(SELECT COUNT(*) FROM "user_post_comments" WHERE "user_post_id" = "UserPost".id)'), 'comment_count'],
            'created_at'
        ],
        //@ts-ignore
        include : [
            {
                //@ts-ignore
                model : UserPostComment,
                required : false,
                where : {
                    parent_comment_id : null
                },
                include : {
                    //@ts-ignore
                    model : UserPostComment,
                    as : 'children'
                }
            },
            {
                //@ts-ignore
                model : User,
                attributes : ['username']
            }
        ]
    }

    public static async getPosts(ctx : ParameterizedContext){
        let { q, order_by, sort_by } = ctx.query

        let query = PostController.getPostsBaseQuery

        if(order_by !== 'asc' && order_by !== 'desc'){
            order_by = 'asc'
        }

        if(q && q != ''){
            query = {
                ...query,
                //@ts-ignore
                where : {
                    title : {
                        [Op.iLike] : `%${q}%`
                    }
                }
            }
        }

        if(sort_by){
            let order

            switch(sort_by){
                case 'username':
                    order = [[User, 'username', order_by]]
                    break
                case 'date':
                    order = [['created_at', order_by]]
                    break
                case 'likes':
                    order = [[literal('"likes_count"'), order_by]]
                    break
                case 'comments':
                    order = [[literal('"comment_count"'), order_by]]
                    break
            }

            query = {
                ...query,
                //@ts-ignore
                order
            }
        }

        //@ts-ignore
        const posts = await UserPost.findAll(query)
        
        ctx.body = posts
    }

    public static async createPost(ctx : ParameterizedContext){
        const { content, title, is_moderation_enabled } = ctx.request.body

        const post = await UserPost.create({
            content,
            title,
            is_moderation_enabled,
            user_id : ctx.user.id
        })

        ctx.body = post
    }

    public static async updatePost(ctx : ParameterizedContext){
        const { content, title } = ctx.request.body
        const { id } = ctx.params

        if(!content && !title) ctx.throw(400, ERR_INVALID_BODY)

        const post = await UserPost.findOne({
            where : {
                id
            }
        })

        if(!post) ctx.throw(404, ERR_POST_NOT_FOUND)
        if(post.user_id !== ctx.user.id) ctx.throw(403, ERR_FORBIDDEN)

        post.content = content || post.content
        post.title = title || post.title

        await post.save()

        ctx.body = {
            message : 'Post updated'
        }
    }

    public static async deletePost(ctx : ParameterizedContext){
        const { id } = ctx.params
        
        const post = await UserPost.findOne({
            where : {
                id
            }
        })

        if(!post) ctx.throw(404, ERR_POST_NOT_FOUND)
        if(post.user_id !== ctx.user.id) ctx.throw(403, 'Forbidden')

        await post.destroy()

        ctx.body = {
            message : 'Post deleted'
        }
    }

    public static async createComment(ctx : ParameterizedContext){
        const { id, commentId } = ctx.params
        const { content } = ctx.request.body

        if(!content) ctx.throw(400, ERR_CONTENT_NOT_PROVIDED)
        
        const post = await UserPost.findOne({
            where : {
                id
            },
            //@ts-ignore
            inlcude : User
        })

        if(!post || !post.id) ctx.throw(404, ERR_POST_NOT_FOUND)

        let parentComment
        if(commentId){
            parentComment = await UserPostComment.findOne({
                where : {
                    id : commentId
                },
                //@ts-ignore
                include : User
            })

            if(!parentComment){
                ctx.throw(404, ERR_PARENT_COMMENT_NOT_FOUND)
            }

            if(parentComment.parent_comment_id){
                ctx.throw(400, ERR_PARENT_COMMENT_TOO_NESTED)
            }
        }

        await UserPostComment.create({
            user_id : ctx.user.id,
            user_post_id : post.id,
            parent_comment_id : commentId,
            content
        })

        const job = agenda.create('send_comment_notification', {
            username : ctx.user.username,
            //@ts-ignore
            to : post.User.email,
            post_title : post.title,
            content
        })

        await job.save()

        if(parentComment){
            const job = agenda.create('send_reply_notification', {
                username : ctx.user.username,
                //@ts-ignore
                to : parentComment.User.email,
                post_title : post.title,
                content
            })

            await job.save()
        }

        ctx.status = 201
        ctx.body = {
            message : 'Comment Created'
        }
    }

    public static async deleteComment(ctx : ParameterizedContext){
        const { postId, commentId } = ctx.params

        const comment = await UserPostComment.findOne({
            where : {
                user_post_id : postId,
                user_id : ctx.user.id,
                id : commentId
            }
        })

        if(!comment) ctx.throw(404, ERR_COMMENT_NOT_FOUND)

        await comment.destroy()

        ctx.body = {
            message : 'Comment deleted'
        }
    }

    public static async unlikePost(ctx : ParameterizedContext){
        const like = await UserPostLike.findOne({
            where : {
                user_post_id : ctx.params.id,
                user_id : ctx.user.id
            }
        })

        if(!like){
            ctx.throw(400, ERR_NO_LIKE_FOUND)
        }

        await like.destroy()

        ctx.status = 201
        ctx.body = {
            message : 'Post Unliked'
        }
    }

    public static async likePost(ctx : ParameterizedContext){
        const post = await UserPost.findOne({
            where : {
                id : ctx.params.id
            },
            //@ts-ignore
            include : User
        })

        if(!post || !post.id){
            ctx.throw(404, ERR_POST_NOT_FOUND)
        }

        //@ts-ignore
        const ownerEmail = post.User.email

        try{
            await UserPostLike.create({
                user_id : ctx.user.id,
                user_post_id : post.id
            })
        }catch(e){
            ctx.throw(400, ERR_LIKED_POST_TWICE)
        }

        const job = agenda.create('send_like_notification', {
            username : ctx.user.username,
            to : ownerEmail,
            title : post.title,
        })

        await job.save()

        ctx.status = 201
        ctx.body = {
            message : 'Post Liked'
        }
    }
}