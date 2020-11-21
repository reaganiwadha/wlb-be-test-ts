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
guardedRoute.delete('/posts/:id', PostController.deletePost)
guardedRoute.post('/posts/:id/like', PostController.likePost)
guardedRoute.delete('/posts/:id/unlike', PostController.unlikePost)
guardedRoute.post('/posts/:id/comments', PostController.createComment)
guardedRoute.post('/posts/:id/comments/:commentId', PostController.createComment)
guardedRoute.delete('/posts/:postId/comments/:commentId', PostController.deleteComment)
guardedRoute.delete('/posts/:postId/comments/:parentCommentId/:commentId', PostController.deleteComment)
guardedRoute.put('/posts/:id', PostController.updatePost)

router.use(guardedRoute.routes())

export default router
