import { Next, ParameterizedContext } from "koa"
import Log from "../mongooseModels/Log"

export default async function loggingMiddleware(ctx : ParameterizedContext, next : Next){
    const start = Date.now()

    await next()

    const log = new Log({
        path : ctx.path,
        request : JSON.stringify(ctx.request.body),
        response : JSON.stringify(ctx.response.body),
        timestamp : new Date(),
        responseTime : Date.now() - start
    })
 
    await log.save()
}