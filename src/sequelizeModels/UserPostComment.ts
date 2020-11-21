import { Model, DataTypes } from "sequelize"
import sequelize from '../config/sequelize'
import User from "./User"
import UserPost from "./UserPost"

interface UserPostCommentAttributes{
    id? : number
    user_id : number
    user_post_id : number
    parent_comment_id? : number
    content : string
}

export default class UserPostComment extends Model<UserPostCommentAttributes> implements UserPostCommentAttributes{
    public id? : number
    public user_id!: number
    public user_post_id!: number
    public parent_comment_id?: number
    public content!: string
}

UserPostComment.init(
    {
        id : {
            type : DataTypes.INTEGER,
            primaryKey : true,
            autoIncrement : true
        },
        user_id : {
            type : DataTypes.INTEGER,
            references : {
                model : 'users',
                key : 'id'
            }
        },
        user_post_id : {
            type : DataTypes.INTEGER,
            references : {
                model : 'user_posts',
                key : 'id'
            },
            onDelete : 'CASCADE'
        },
        parent_comment_id : {
            type : DataTypes.INTEGER,
            references : {
                model : 'user_post_comments',
                key : 'id'
            },
            onDelete : 'CASCADE'
        },
        content : {
            type : DataTypes.STRING
        }
    },
    {
        tableName : 'user_post_comments',
        sequelize,
        timestamps: true,
        updatedAt : false,
        underscored : true
    }
)

UserPostComment.belongsTo(User)
UserPostComment.belongsTo(UserPost)
User.hasMany(UserPostComment)
UserPost.hasMany(UserPostComment)

UserPostComment.hasMany(UserPostComment, {
    foreignKey : 'parent_comment_id',
    onDelete: 'CASCADE',
    as : 'children',
})