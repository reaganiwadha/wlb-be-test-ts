import { config } from 'dotenv'
config()

import Koa from 'koa'
import koaLogger from 'koa-logger'
import router from './routing'
import loggingMiddleware from './middlewares/logging'
import bodyParser from 'koa-bodyparser'
import errorHandler from './middlewares/errorHandler'

import mongoose from 'mongoose'

if(process.env.MONGO_URI){
    mongoose.connect(process.env.MONGO_URI, {
        useUnifiedTopology : true,
        useNewUrlParser : true
    })
}

const PORT = process.env.PORT || 8000
const app = new Koa()

app.use(loggingMiddleware)
app.use(errorHandler)
app.use(bodyParser())
app.use(koaLogger())
app.use(router.routes())

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`)
})
