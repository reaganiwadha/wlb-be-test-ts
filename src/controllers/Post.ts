import { ParameterizedContext } from "koa";
import User from "../sequelizeModels/User";
import UserPost from "../sequelizeModels/UserPost";

export default class PostController{
    public static async getPosts(ctx : ParameterizedContext){
        let { q, order_by, sort_by } = ctx.query

        const posts = await UserPost.findAll({
            // 
        })
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

    public static async likePost(ctx : ParameterizedContext){
        const post = await UserPost.findOne({
            where : {
                id : ctx.params.id
            },
            include : UserPost.associations.user
        })

        ctx.body = post        
        console.log(post)
    }
}