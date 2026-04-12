import { PrimaryKey, Property } from "@mikro-orm/decorators/legacy";
import { BaseEntity as MikroBaseEntity, type Opt } from "@mikro-orm/sqlite";

export abstract class BaseEntity extends MikroBaseEntity {
    @PrimaryKey({ autoincrement: true })
    id!: bigint;

    @Property()
    createdAt: Opt<Date> = new Date();

    @Property({ onUpdate: () => new Date() })
    updatedAt: Opt<Date> = new Date();
}
