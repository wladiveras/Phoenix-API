import { NextFunction, Response } from 'express'
import * as jwt from 'jsonwebtoken'
import AuthenticationTokenMissingException from '@exceptions/AuthenticationTokenMissingException'
import WrongAuthenticationTokenException from '@exceptions/WrongAuthenticationTokenException'
import DataStoredInToken from '@interfaces/dataStoredInToken'
import RequestWithUser from '@interfaces/requestWithUser.interface'
import userModel from '@modules/user/user.model'
import config from 'config'

async function authMiddleware(request: RequestWithUser, response: Response, next: NextFunction) {
    const cookies = request.cookies
    if (cookies && cookies.Authorization) {
        const secret = config.get('misc.jwtSecret')
        try {
            // @ts-ignore
            const verificationResponse = jwt.verify(cookies.Authorization, secret) as DataStoredInToken
            const id = verificationResponse._id
            const user = await userModel.findById(id)
            if (user) {
                request.user = user
                next()
            } else {
                next(new WrongAuthenticationTokenException())
            }
        } catch (error) {
            next(new WrongAuthenticationTokenException())
        }
    } else {
        next(new AuthenticationTokenMissingException())
    }
}

export default authMiddleware
