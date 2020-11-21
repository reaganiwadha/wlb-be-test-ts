import sequelize from '../config/sequelize'
import { Model, DataTypes, Association, HasManyGetAssociationsMixin } from 'sequelize'
import User from './User';
import UserPost from './UserPost';

interface UserPostLikeAttributes{
    id? : number
    user_id : number,
    user_post_id : number,
}

export default class UserPostLike extends Model<UserPostLikeAttributes> implements UserPostLikeAttributes{
    public id?: number | undefined;
    public user_id!: number;
    public user_post_id!: number;
}

UserPostLike.init(
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
            },
            onDelete : 'CASCADE'
        },
        user_post_id : {
           type : DataTypes.INTEGER,
           references : {
               model : 'user_posts',
               key : 'id'
           },
           onDelete : 'CASCADE'
        }
    },
    {
        tableName : 'user_post_likes',
        sequelize,
        timestamps: false,
        underscored : true
    }
)

UserPostLike.belongsTo(User, { foreignKey : 'user_id' })
UserPostLike.belongsTo(UserPost)
UserPost.hasMany(UserPostLike)
User.hasMany(UserPostLike, { onDelete: 'cascade' })