import { InjectRepository } from "@mikro-orm/nestjs";
import type { EntityRepository } from "@mikro-orm/sqlite";
import { Injectable } from "@nestjs/common";

import { TodoEntity } from "./todo.entity";

@Injectable()
export class TodoService {
    constructor(
        @InjectRepository(TodoEntity) private readonly repo: EntityRepository<TodoEntity>,
    ) { }

    async findAll(): Promise<TodoEntity[]> {
        return this.repo.findAll({
            orderBy: { id: "DESC" },
        });
    }

    async create(title: string): Promise<TodoEntity> {
        const todo = this.repo.create({ title, completed: false });
        this.repo.getEntityManager().persist(todo);
        await this.repo.getEntityManager().flush();
        return todo;
    }

    async delete(id: number): Promise<void> {
        const todo = await this.repo.findOne({ id });
        if (todo) {
            this.repo.getEntityManager().remove(todo);
            await this.repo.getEntityManager().flush();
        }
    }
}
