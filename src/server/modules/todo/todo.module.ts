import { Module } from "@nestjs/common";

import { DatabaseModule } from "../../core/database/database.module";
import { TodoController } from "./controllers/todo.controller";
import { TodoPageController } from "./controllers/todo-page.controller";
import { TodoModel } from "./todo.model";
import { TodoService } from "./todo.service";

@Module({
    imports: [DatabaseModule.forFeature(TodoModel)],
    controllers: [TodoPageController, TodoController],
    providers: [TodoService],
})
export class TodoModule { }
