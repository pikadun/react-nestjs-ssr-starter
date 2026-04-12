import { Entity, Property } from "@mikro-orm/decorators/legacy";
import type { Opt } from "@mikro-orm/sqlite";

import { BaseEntity } from "../../common/entities/base.entity";

@Entity({
    tableName: "todos",
})
export class TodoEntity extends BaseEntity {
    @Property()
    title!: string;

    @Property()
    completed: Opt<boolean> = false;
}
