import { Good } from "./good.interface"

class GoodMapper {
    static toDomain(raw: any): Good {
        return {
            id: raw.id,
            name: raw.name,
            price: parseFloat(raw.price),
            category: {
                id: raw.category.id,
                name: raw.category.name
            }
        }
    }
}

export {
    GoodMapper
}