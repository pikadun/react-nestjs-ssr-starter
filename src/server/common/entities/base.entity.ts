import { BaseEntity as MikroBaseEntity, OptionalProps } from "@mikro-orm/core";
import { PrimaryKey, Property } from "@mikro-orm/decorators/legacy";

export abstract class BaseEntity extends MikroBaseEntity {
    [OptionalProps]?: "createdAt" | "updatedAt";

    @PrimaryKey({ autoincrement: true })
    id!: bigint;

    @Property()
    createdAt = new Date();

    @Property({ onUpdate: () => new Date() })
    updatedAt = new Date();
}
