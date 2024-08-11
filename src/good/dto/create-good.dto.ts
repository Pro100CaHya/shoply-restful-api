import { IsNumber, IsPositive, IsString, Length } from "class-validator";

class CreateGoodDto {
    @Length(2, 32)
    @IsString()
    public name: string;

    @IsNumber()
    @IsPositive()
    public price: number;

    @IsNumber()
    public categoryId: number;
}

export {
    CreateGoodDto
}