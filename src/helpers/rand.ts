import base64url from 'base64url'
import { randomBytes } from 'crypto'

export function generateURLSafeRandom(len = 64){
    return base64url(randomBytes(len))
}
