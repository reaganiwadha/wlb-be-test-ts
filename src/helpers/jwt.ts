import jwt from 'jsonwebtoken'

const JWT_SECRET = 'secret'

export interface UserJWTPayload{
    id : number,
    email : string
}

export function encodeJwt(payload : UserJWTPayload) : string{
    return jwt.sign(payload, JWT_SECRET)
}

export function decodeJwt(token : string){
    return jwt.verify(token, JWT_SECRET)
}