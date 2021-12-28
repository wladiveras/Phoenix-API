import App from './app'
import AuthenticationController from '@modules/authentication/authentication.controller'
import PostController from '@modules/post/post.controller'
import ReportController from '@modules/report/report.controller'
import UserController from '@modules/user/user.controller'

const app = new App(
    [
        new PostController(),
        new AuthenticationController(),
        new UserController(),
        new ReportController(),
    ],
)

app.listen()

