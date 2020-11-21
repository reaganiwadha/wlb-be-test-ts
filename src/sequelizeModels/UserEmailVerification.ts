import sequelize from '../config/sequelize'
import { Model, DataTypes, Association, BelongsToManyGetAssociationsMixin } from 'sequelize'
import User from './User'

interface UserEmailVerificationAttributes{
    id? : number
    user_id : number
    token : string
    expires_at : Date
}

export default class UserEmailVerification extends Model<UserEmailVerificationAttributes> implements UserEmailVerificationAttributes{
    public id!: number
    public user_id!: number
    public token!: string
    public expires_at!: Date
}

UserEmailVerification.init(
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
        token : {
            type : DataTypes.STRING
        },
        expires_at : {
            type : DataTypes.DATE
        }
    },
    {
        tableName : 'user_email_verifications',
        sequelize,
        timestamps: false,
        underscored : true
    }
)
