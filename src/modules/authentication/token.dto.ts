import { IsString } from 'class-validator'

class TokenDto {
    @IsString()
    public id: string
    @IsString()
    public token: string
}

export default TokenDto
