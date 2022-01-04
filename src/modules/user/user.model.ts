import * as mongoose from 'mongoose'
import User from './user.interface'

const addressSchema = new mongoose.Schema({
    city: String,
    country: String,
    street: String,
})

const userSchema = new mongoose.Schema(
    {
        role: String,
        firstName: String,
        lastName: String,
        birthday: String,
        avatar: String,
        email: String,
        password: {
            type: String,
            get: (): undefined => undefined,
        },
        address: addressSchema,
        updatedAt : { type : Date, default: Date.now },
        createdAt : { type : Date, default: Date.now }
    },
    {
        toJSON: {
            virtuals: true,
            getters: true,
        },
    },
)

userSchema.virtual('fullName').get(function () {
    return `${this.firstName} ${this.lastName}`
})

userSchema.virtual('posts', {
    ref: 'Post',
    localField: '_id',
    foreignField: 'author',
})

const userModel = mongoose.model<User & mongoose.Document>('User', userSchema)

export default userModel
