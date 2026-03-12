import { DataTypes, Model } from "@sequelize/core";
import { Attribute, Table } from "@sequelize/core/decorators-legacy";

@Table({
    tableName: "todos",
    modelName: "Todo",
})
export class TodoModel extends Model {
    @Attribute(DataTypes.STRING)
    declare title: string;

    @Attribute(DataTypes.BOOLEAN)
    declare completed: boolean;
}
