import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";

import { TodoController } from "./controllers/todo.controller";
import { TodoPageController } from "./controllers/todo-page.controller";
import { TodoEntity } from "./todo.entity";
import { TodoService } from "./todo.service";

@Module({
    imports: [MikroOrmModule.forFeature([TodoEntity])],
    controllers: [TodoPageController, TodoController],
    providers: [TodoService],
})
export class TodoModule { }
