import { IsString, Length } from "class-validator";

class CreateCategoryDto {
    @Length(2, 32)
    @IsString()
    public name: string;
}

export {
    CreateCategoryDto
}