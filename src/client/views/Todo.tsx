import {
    ActionIcon,
    Alert,
    Button,
    Card,
    Group,
    Loader,
    Stack,
    Text,
    TextInput,
    Title,
} from "@mantine/core";
import type { ListTodosResponse } from "@shared/schemas/todo.schema";
import React, { useCallback, useMemo, useState } from "react";
import { useLoaderData } from "react-router";

type TodoItem = ListTodosResponse[number];

const TODO_API = "/api/todo";

export const Component: React.FC = () => {
    const todoList = useLoaderData<ListTodosResponse>();

    const [todos, setTodos] = useState<TodoItem[]>(todoList);
    const [newTitle, setNewTitle] = useState("");
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const canSubmit = useMemo(() => newTitle.trim().length > 0 && !submitting, [newTitle, submitting]);

    const fetchTodos = useCallback(async () => {
        setError(null);
        setLoading(true);
        try {
            const response = await fetch(TODO_API, { method: "GET" });
            if (!response.ok) {
                throw new Error(`Request failed: ${response.status}`);
            }
            const data = (await response.json()) as ListTodosResponse;
            setTodos(data);
        }
        catch {
            setError("Failed to load todo list.");
        }
        finally {
            setLoading(false);
        }
    }, []);

    const handleCreate = useCallback(async () => {
        const title = newTitle.trim();
        if (!title) {
            return;
        }

        setError(null);
        setSubmitting(true);
        try {
            const response = await fetch(TODO_API, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ title }),
            });
            if (!response.ok) {
                throw new Error(`Request failed: ${response.status}`);
            }
            const createdTodo = (await response.json()) as TodoItem;
            setTodos(prev => [createdTodo, ...prev]);
            setNewTitle("");
        }
        catch {
            setError("Failed to create todo.");
        }
        finally {
            setSubmitting(false);
        }
    }, [newTitle]);

    const handleDelete = useCallback(async (id: number) => {
        setError(null);
        try {
            const response = await fetch(`${TODO_API}/${id}`, {
                method: "DELETE",
            });
            if (!response.ok) {
                throw new Error(`Request failed: ${response.status}`);
            }
            setTodos(prev => prev.filter(todo => todo.id !== id));
        }
        catch {
            setError("Failed to delete todo.");
        }
    }, []);

    return (
        <Stack align="center" justify="flex-start" py={48} px={16} mih="100vh" gap="lg">
            <Stack w="100%" maw={680} gap="md">
                <Group justify="space-between" align="end">
                    <Title order={2}>Todo List</Title>
                    <Button variant="light" onClick={() => void fetchTodos()} loading={loading}>
                        Refresh
                    </Button>
                </Group>

                <Group align="end" wrap="nowrap">
                    <TextInput
                        label="New Todo"
                        placeholder="What do you need to do?"
                        value={newTitle}
                        onChange={(event) => { setNewTitle(event.currentTarget.value); }}
                        onKeyDown={(event) => {
                            if (event.key === "Enter" && canSubmit) {
                                void handleCreate();
                            }
                        }}
                        flex={1}
                        maxLength={120}
                    />
                    <Button onClick={() => void handleCreate()} loading={submitting} disabled={!canSubmit}>
                        Add
                    </Button>
                </Group>

                {error ? <Alert color="red">{error}</Alert> : null}

                {loading
                    ? (
                            <Group justify="center" py="xl">
                                <Loader />
                            </Group>
                        )
                    : null}

                {!loading && todos.length === 0
                    ? (
                            <Card withBorder radius="md" p="lg">
                                <Text c="dimmed">No todos yet. Add your first one.</Text>
                            </Card>
                        )
                    : null}

                {!loading
                    ? todos.map(todo => (
                            <Card key={todo.id} withBorder radius="md" p="md">
                                <Group justify="space-between" wrap="nowrap">
                                    <Text fw={500}>{todo.title}</Text>
                                    <ActionIcon
                                        variant="subtle"
                                        color="red"
                                        onClick={() => void handleDelete(todo.id)}
                                        aria-label={`Delete todo ${todo.title}`}
                                    >
                                        <Text size="sm">Delete</Text>
                                    </ActionIcon>
                                </Group>
                            </Card>
                        ))
                    : null}
            </Stack>
        </Stack>
    );
};
