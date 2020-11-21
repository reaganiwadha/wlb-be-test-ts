import sequelize from '../config/sequelize'
import { Model, DataTypes, Association, BelongsToManyGetAssociationsMixin } from 'sequelize'
import User from './User'

interface UserPostAttributes{
    id? : number
    user_id : number
    title : string
    content : string
    is_moderation_enabled : boolean
    created_at? : Date
}

export default class UserPost extends Model<UserPostAttributes> implements UserPostAttributes{
    public id?: number | undefined
    public user_id!: number
    public title!: string
    public content!: string
    public is_moderation_enabled!: boolean
    public created_at?: Date

    public getOwner! : BelongsToManyGetAssociationsMixin<User>

    public static associations: {
        user : Association<UserPost, User>
    }
}

UserPost.init(
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
                key : 'id',
            }
        },
        title : {
            type : DataTypes.STRING
        },
        content : {
            type : DataTypes.STRING
        },
        is_moderation_enabled : {
            type : DataTypes.BOOLEAN
        },
        created_at : {
            type : DataTypes.DATE
        }
    },
    {
        tableName : 'user_posts',
        sequelize,
        timestamps: true,
        updatedAt : false,
        underscored : true
    }
)

UserPost.belongsTo(User)
User.hasMany(UserPost, { onDelete: 'cascade' })
