import { IsString } from 'class-validator'

class TokenDto {
    @IsString()
    public uid: string
    @IsString()
    public hash: string
    @IsString()
    public token: string
}

export default TokenDto
