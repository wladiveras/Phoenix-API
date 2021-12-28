import * as bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'
import UserWithThatEmailAlreadyExistsException from '@exceptions/UserWithThatEmailAlreadyExistsException'
import DataStoredInToken from '@interfaces/dataStoredInToken'
import TokenData from '@interfaces/tokenData.interface'
import CreateUserDto from '@modules/user/user.dto'
import User from '@modules/user/user.interface'
import userModel from '@modules/user/user.model'
import config from 'config'

class AuthenticationService {
    public user = userModel

    public async register(userData: CreateUserDto) {
        if (
            await this.user.findOne({ email: userData.email })
        ) {
            throw new UserWithThatEmailAlreadyExistsException(userData.email)
        }
        const hashedPassword = await bcrypt.hash(userData.password, 10)
        const user = await this.user.create({
            ...userData,
            password: hashedPassword,
        })
        const tokenData = this.createToken(user)
        const cookie = this.createCookie(tokenData)
        return {
            cookie,
            user,
        }
    }

    public createCookie(tokenData: TokenData) {
        return `Authorization=${tokenData.token} HttpOnly Max-Age=${tokenData.expiresIn}`
    }

    public createToken(user: User): TokenData {
        const expiresIn = 60 * 60 // an hour
        const secret = config.get('misc.jwtSecret')
        const dataStoredInToken: DataStoredInToken = {
            _id: user._id,
        }
        return {
            expiresIn,
            // @ts-ignore
            token: jwt.sign(dataStoredInToken, secret, { expiresIn }),
        }
    }
}

export default AuthenticationService
