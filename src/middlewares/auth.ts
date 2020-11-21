import jwt from 'jsonwebtoken'
import { Next, ParameterizedContext } from 'koa'
import { decodeJwt, UserJWTPayload } from '../helpers/jwt'
import User from '../sequelizeModels/User'

export default async function authMiddleware(ctx : ParameterizedContext, next : Next){
    if(!ctx.headers.authorization){
        ctx.throw(401, 'Token not provided')
    }

    const token = ctx.headers.authorization.split('Bearer ')
    if(!token[1]){
        ctx.throw(401, 'Token not provided')
    }

    const payload = decodeJwt(token[1]) as UserJWTPayload

    if(!payload){
        ctx.throw(401, 'Invalid Token')
    }

    const user = await User.findOne({
        where : {
            email : payload.email
        }
    })

    if(!user){
        ctx.throw(401, 'Invalid Token')
    }

    if(!user.is_verified){
        ctx.throw(401, 'Account has not been activated')
    }

    ctx.user = user

    await next()
}