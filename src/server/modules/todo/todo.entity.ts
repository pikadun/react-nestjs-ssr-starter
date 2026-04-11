import { Entity, Property } from "@mikro-orm/decorators/legacy";

import { BaseEntity } from "../../common/entities/base.entity";

@Entity({
    tableName: "todos",
})
export class TodoEntity extends BaseEntity {
    @Property()
    title!: string;

    @Property()
    completed = false;
}
