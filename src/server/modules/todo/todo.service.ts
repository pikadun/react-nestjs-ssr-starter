import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityManager, type EntityRepository } from "@mikro-orm/sqlite";
import { Injectable } from "@nestjs/common";

import { TodoEntity } from "./todo.entity";

@Injectable()
export class TodoService {
    constructor(
        @InjectRepository(TodoEntity) private readonly repo: EntityRepository<TodoEntity>,
        private readonly em: EntityManager,
    ) { }

    async findAll(): Promise<TodoEntity[]> {
        return this.repo.findAll({
            orderBy: { id: "DESC" },
        });
    }

    async create(title: string): Promise<TodoEntity> {
        const todo = this.repo.create({ title });
        await this.em.flush();
        return todo;
    }

    async delete(id: number): Promise<void> {
        const todo = await this.repo.findOne({ id });
        if (todo) {
            this.em.remove(todo);
            await this.em.flush();
        }
    }
}
