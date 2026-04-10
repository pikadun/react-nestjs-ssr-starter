import { Card, Text } from "@mantine/core";
import type { ListTodosResponse } from "@shared/schemas/todo.schema";
import React from "react";

import { TodoItem } from "./TodoItem";

interface TodoListProps {
    todos: ListTodosResponse | undefined;
    onDelete: (id: number) => void;
}

export const TodoList: React.FC<TodoListProps> = ({ todos, onDelete }) => {
    if (!todos) {
        return (
            <Card withBorder radius="md" p="lg">
                <Text c="dimmed">Loading todos...</Text>
            </Card>
        );
    }

    if (todos.length === 0) {
        return (
            <Card withBorder radius="md" p="lg">
                <Text c="dimmed">No todos yet. Add your first one.</Text>
            </Card>
        );
    }

    return (
        <>
            {todos.map(todo => (
                <TodoItem
                    key={todo.id}
                    id={todo.id}
                    title={todo.title}
                    onDelete={onDelete}
                />
            ))}
        </>
    );
};
