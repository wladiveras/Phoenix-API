// @ts-nocheck
import { Request, Response, NextFunction, Router } from 'express'
import * as jwt from 'jsonwebtoken'
import * as bcrypt from 'bcrypt'

import WrongCredentialsException from '@exceptions/WrongCredentialsException'
import Controller from '@interfaces/controller.interface'
import DataStoredInToken from '@interfaces/dataStoredInToken'
import TokenData from '@interfaces/tokenData.interface'
import validationMiddleware from '@middleware/validation.middleware'
import Logger from '@src/utils/Logger'

import CreateUserDto from '@modules/user/user.dto'
import User from '@modules/user/user.interface'
import userModel from '@modules/user/user.model'

import AuthenticationService from './authentication.service'
import LogInDto from './logIn.dto'
import TokenDto from './token.dto'
import config from 'config'
import refreshTokens from '@utils/refreshTokens'

class AuthenticationController implements Controller {
    public path = '/auth'
    public router = Router()
    public authenticationService = new AuthenticationService()
    private user = userModel

    constructor() {
        this.initializeRoutes()
    }

    private initializeRoutes() {
        this.router.post(`${this.path}/register`, validationMiddleware(CreateUserDto), this.registration)
        this.router.post(`${this.path}/login`, validationMiddleware(LogInDto), this.loggingIn)
        this.router.post(`${this.path}/token`, validationMiddleware(TokenDto), this.refreshToken)
        this.router.post(`${this.path}/logout`, this.loggingOut)
    }

    private registration = async (request: Request, response: Response, next: NextFunction) => {
        const userData: CreateUserDto = request.body
        try {
            const { cookie, user } = await this.authenticationService.register(userData)
            response.setHeader('Set-Cookie', [cookie])
            response.send(user)
        } catch (error) {
            next(error)
        }
    }

    private loggingIn = async (request: Request, response: Response, next: NextFunction) => {
        const logInData: LogInDto = request.body
        const user = await this.user.findOne({ email: logInData.email })

        if (user) {
            const isPasswordMatching = await bcrypt.compare(
                logInData.password,
                user.get('password', null, { getters: false }),
            )

            if (isPasswordMatching) {
                const accessToken = this.createToken(user)
                const refreshToken = this.createToken(user, true)

                Logger.debug(`[loggingIn] user ${user.fullName} logged in`)

                response.send({
                    response: {
                        user: {
                            id: user.id,
                            name: user.fullName,
                            email: user.email,
                            createdAt: user.createdAt,
                            updatedAt: user.updatedAt,
                            role: user.role,
                            exceptions: [], // TODO: add exception special permissions
                            permissions: [], // TODO: add permissions
                        },
                        token: accessToken.token,
                        refreshToken: refreshToken.token,
                    },
                    message: 'User login successfully.',
                    status: 200,
                })
            } else {
                next(new WrongCredentialsException())
            }
        } else {
            next(new WrongCredentialsException())
        }
    }

    private refreshToken = async (request: Request, response: Response, next: NextFunction) => {
        const tokenData: TokenDto = request.body
        const refreshSecret = config.get('misc.refreshSecret')

        if (jwt.verify(tokenData.token, refreshSecret) as DataStoredInToken) {
            const user = await this.user.findOne({ _id: tokenData.id })

            const accessToken = this.createToken(user)
            const refreshToken = this.createToken(user, true)

            Logger.debug(`[refreshToken] refreshTokens updated `)

            response.send({
                response: {
                    user: {
                        id: user.id,
                        name: user.fullName,
                        email: user.email,
                        createdAt: user.createdAt,
                        updatedAt: user.updatedAt,
                        role: user.role,
                        exceptions: [], // TODO: add exception special permissions
                        permissions: [], // TODO: add permissions
                    },
                    token: accessToken.token,
                    refreshToken: refreshToken.token,
                },
                message: 'Refresh token successfully.',
                status: 200,
            })
        } else {
            next(new WrongCredentialsException())
        }
    }

    private loggingOut = (request: Request, response: Response, next: NextFunction) => {
        Logger.debug(`[loggingOut] refreshTokens updated << ${JSON.stringify(refreshTokens)}`)
        response.send({
            message: 'User logged out successfully.',
            status: 200,
        })
    }

    private createToken(user: User, refresh = false): TokenData {
        const expiresIn = '1m'
        const refreshExpiresIn = '1d'
        const secret = config.get('misc.jwtSecret')
        const refreshSecret = config.get('misc.refreshSecret')

        const dataStoredInToken: DataStoredInToken = {
            _id: user._id,
        }
        return {
            expiresIn: refresh ? refreshExpiresIn : expiresIn,
            token: refresh
                ? jwt.sign(dataStoredInToken, refreshSecret, { expiresIn: refreshExpiresIn })
                : jwt.sign(dataStoredInToken, secret, { expiresIn: expiresIn }),
        }
    }
}

export default AuthenticationController
