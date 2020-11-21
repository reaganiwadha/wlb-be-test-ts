import { Next, ParameterizedContext } from "koa"

export default async function loggingMiddleware(ctx : ParameterizedContext, next : Next){
    await next()
    console.log(ctx.path)
}