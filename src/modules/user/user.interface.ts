interface User {
    _id: string
    role: string
    firstName: string
    lastName: string
    fullName: string
    email: string
    password: string
    address?: {
        street: string,
        city: string,
    },
    avatar?: string,
    birthday?: string,
    updatedAt: Date,
    createdAt: Date,
}

export default User
