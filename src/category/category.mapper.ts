import { Category } from "./category.interface";

class CategoryMapper {
    static toDomain(raw: any): Category {
        return {
            id: raw.id,
            name: raw.name
        }
    }
}

export {
    CategoryMapper
}