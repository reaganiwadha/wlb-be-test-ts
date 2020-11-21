import { ParameterizedContext } from 'koa'
import agenda from '../config/agenda'
import User from '../sequelizeModels/User'
import UserEmailVerification from '../sequelizeModels/UserEmailVerification'

import Joi from 'joi'
import { hashPassword, verifyPassword } from '../helpers/password'
import { encodeJwt } from '../helpers/jwt'
import { generateURLSafeRandom } from '../helpers/rand'

import { ERR_INVALID_TOKEN, ERR_INVALID_USERNAME_PASSWORD, ERR_TOKEN_NOT_PROVIDED, ERR_USER_UNVERIFIED } from '../consts/errors'

const registerSchema = Joi.object({
    username : Joi.string()
        .alphanum()
        .min(4)
        .max(30)
        .required(),
    password : Joi.string()
        .required()
        .min(8),
    email : Joi.string().email()
})

export default class UserController{
    public static async register(ctx : ParameterizedContext): Promise<void>{
        let { email, password, username } = ctx.request.body

        try{
            await registerSchema.validateAsync({ email, password, username })
        } catch (err){
            ctx.throw(400, err)
        }

        password = await hashPassword(password)

        const user = await User.create({
            email,
            username,
            password
        })

        const token = generateURLSafeRandom()

        const tommorow = new Date()
        tommorow.setDate(tommorow.getDate() + 1)

        await UserEmailVerification.create({
            user_id : user.id,
            token,
            expires_at : tommorow
        })

        const job = agenda.create('send_verification_email', { to : email, token })
        await job.save()

        ctx.status = 201
        ctx.body = {
            message : 'created'
        }
    }

    public static async verify(ctx : ParameterizedContext): Promise<void>{
        const { token } = ctx.query

        if(!token){
            ctx.throw(400, ERR_TOKEN_NOT_PROVIDED)
        }

        const uev = await UserEmailVerification.findOne({
            where : {
                token
            }
        })

        if(!uev){
            ctx.throw(400, ERR_INVALID_TOKEN)
        }

        await User.update({
            is_verified : true
        }, {
            where : {
                id : uev.user_id
            }
        })

        await uev.destroy()

        ctx.body = {
            message : 'User Verified'
        }
    }

    public static async login(ctx : ParameterizedContext): Promise<void>{
        const { username, password } = ctx.request.body

        const user = await User.findOne({
            where : {
                username
            }
        })

        if(!user){
            ctx.throw(400, ERR_INVALID_USERNAME_PASSWORD)
        }

        if(!user.is_verified){
            ctx.throw(400, ERR_USER_UNVERIFIED)
        }

        const isPasswordCorrect = await verifyPassword(user.password, password)

        if(!isPasswordCorrect){
            ctx.throw(400, ERR_INVALID_USERNAME_PASSWORD)
        }

        const access_token = encodeJwt({
            id : user.id,
            email : user.email
        })

        ctx.body = {
            token_type : 'bearer',
            access_token
        }
    }
}
