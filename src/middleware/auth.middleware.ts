import { NextFunction, Response } from 'express'
import * as jwt from 'jsonwebtoken'
import AuthenticationTokenMissingException from '@exceptions/AuthenticationTokenMissingException'
import WrongAuthenticationTokenException from '@exceptions/WrongAuthenticationTokenException'
import DataStoredInToken from '@interfaces/dataStoredInToken'
import RequestWithUser from '@interfaces/requestWithUser.interface'
import userModel from '@modules/user/user.model'
import Logger from '@utils/Logger'
import config from 'config'

async function authMiddleware(request: RequestWithUser, response: Response, next: NextFunction) {

    const headers = request.headers

    if (headers && headers.authorization) {

        const secret: any = config.get('misc.jwtSecret')

        try {
            const verificationResponse = jwt.verify(headers.authorization, secret) as DataStoredInToken
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
