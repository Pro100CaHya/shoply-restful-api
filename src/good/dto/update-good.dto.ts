import { PartialType } from "@nestjs/mapped-types";
import { CreateGoodDto } from "./create-good.dto";

class UpdateGoodDto extends PartialType(CreateGoodDto) {}

export {
    UpdateGoodDto
}