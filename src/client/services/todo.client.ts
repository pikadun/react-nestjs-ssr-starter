import type { CreateTodo, ListTodosResponse } from "@shared/schemas/todo.schema";

import { httpClient } from "./http";

const TODO_API = "/api/todo";

export const todoQueryKeys = {
    all: ["todos"] as const,
    list: () => [...todoQueryKeys.all, "list"] as const,
};

export const listTodos = async (): Promise<ListTodosResponse> => {
    const { data } = await httpClient.get<ListTodosResponse>(TODO_API);

    return data;
};

export const createTodoItem = async (
    payload: CreateTodo,
): Promise<ListTodosResponse[number]> => {
    const { data } = await httpClient.post<ListTodosResponse[number]>(TODO_API, payload);

    return data;
};

export const deleteTodoItem = async (id: number): Promise<void> => {
    await httpClient.delete(`${TODO_API}/${id}`);
};
