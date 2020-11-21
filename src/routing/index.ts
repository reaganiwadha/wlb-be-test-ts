import Router from 'koa-router'
import PostController from '../controllers/Post'
import UserController from '../controllers/User'
import authMiddleware from '../middlewares/auth'

const router = new Router()

router.post('/register', UserController.register)
router.post('/login', UserController.login)
router.get('/verify', UserController.verify)

const guardedRoute = new Router()

guardedRoute.use(authMiddleware)
guardedRoute.get('/posts', PostController.getPosts)
guardedRoute.post('/posts', PostController.createPost)
guardedRoute.post('/posts/:id/like', PostController.likePost)

router.use(guardedRoute.routes())

export default router
