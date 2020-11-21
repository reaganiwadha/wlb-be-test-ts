import sequelize from '../config/sequelize'
import { Model, DataTypes, Association } from 'sequelize'
import UserEmailVerification from './UserEmailVerification';
import UserPost from './UserPost';

interface UserAttributes{
    id? : number
    username : string
    email : string
    password : string
    is_verified? : boolean
}

export default class User extends Model<UserAttributes> implements UserAttributes{
    public id!: number;
    public username!: string;
    public email!: string;
    public password!: string;
    public is_verified!: boolean;

    public static associations: {
        emailVerifications : Association<User, UserEmailVerification>
    }
}

User.init(
    {
        id : {
            type : DataTypes.INTEGER,
            primaryKey : true,
            autoIncrement : true
        },
        username : {
            type : DataTypes.STRING
        },
        email : {
            type : DataTypes.STRING
        },
        password : {
            type : DataTypes.STRING
        },
        is_verified : {
            type : DataTypes.BOOLEAN,
            defaultValue : false
        }
    },
    {
        tableName : 'users',
        sequelize,
        timestamps: false
    }
)

User.hasMany(UserEmailVerification)
User.hasMany(UserPost)