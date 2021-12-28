import {
    IsOptional,
    IsString,
    ValidateNested,
    IsInt,
} from 'class-validator'

import CreateAddressDto from './address.dto'

class CreateUserDto {

    @IsInt()
    public role: Number

    @IsString()
    public firstName: string

    @IsString()
    public lastName: string

    @IsString()
    public email: string

    @IsString()
    public password: string

    @IsString()
    public birthday: string

    @IsString()
    public avatar: string

    @IsOptional()
    @ValidateNested()
    public address?: CreateAddressDto
}

export default CreateUserDto
