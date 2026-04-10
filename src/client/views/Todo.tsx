import {
    ActionIcon,
    Alert,
    Button,
    Card,
    Group,
    Stack,
    Text,
    TextInput,
    Title,
} from "@mantine/core";
import type { ListTodosResponse } from "@shared/schemas/todo.schema";
import type { RouteHandle } from "@shared/types/route";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useMemo, useState } from "react";

import {
    createTodoItem,
    deleteTodoItem,
    listTodos,
    todoQueryKeys,
} from "../services/todo.client";

export const handle: RouteHandle = {
    hydrate: (queryClient, data) => {
        queryClient.setQueryData(todoQueryKeys.list(), data);
    },
};

export const Component: React.FC = () => {
    const queryClient = useQueryClient();

    const [newTitle, setNewTitle] = useState("");

    const { data: todos, error: queryError, refetch, isRefetching } = useQuery({
        queryKey: todoQueryKeys.list(),
        queryFn: listTodos,
    });

    const createMutation = useMutation({
        mutationFn: (title: string) => createTodoItem({ title }),
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: todoQueryKeys.list(),
            });
            setNewTitle("");
        },
    });

    const deleteMutation = useMutation({
        mutationFn: deleteTodoItem,
        onSuccess: (_data, deletedId) => {
            queryClient.setQueryData<ListTodosResponse>(
                todoQueryKeys.list(),
                old => (old ?? []).filter(todo => todo.id !== deletedId),
            );
        },
    });

    const canSubmit = useMemo(
        () => newTitle.trim().length > 0 && !createMutation.isPending,
        [newTitle, createMutation.isPending],
    );
    const error = queryError?.message ?? createMutation.error?.message ?? deleteMutation.error?.message ?? null;

    return (
        <Stack align="center" justify="flex-start" py={48} px={16} mih="100vh" gap="lg">
            <Stack w="100%" maw={680} gap="md">
                <Group justify="space-between" align="end">
                    <Title order={2}>Todo List</Title>
                    <Button variant="light" onClick={() => void refetch()} loading={isRefetching}>
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
                                createMutation.mutate(newTitle.trim());
                            }
                        }}
                        flex={1}
                        maxLength={120}
                    />
                    <Button
                        onClick={() => { createMutation.mutate(newTitle.trim()); }}
                        loading={createMutation.isPending}
                        disabled={!canSubmit}
                    >
                        Add
                    </Button>
                </Group>

                {error ? <Alert color="red">{error}</Alert> : null}

                {!todos
                    ? (
                            <Card withBorder radius="md" p="lg">
                                <Text c="dimmed">Loading todos...</Text>
                            </Card>
                        )
                    : null}

                {todos?.length === 0
                    ? (
                            <Card withBorder radius="md" p="lg">
                                <Text c="dimmed">No todos yet. Add your first one.</Text>
                            </Card>
                        )
                    : null}

                {todos?.map(todo => (
                    <Card key={todo.id} withBorder radius="md" p="md">
                        <Group justify="space-between" wrap="nowrap">
                            <Text fw={500}>{todo.title}</Text>
                            <ActionIcon
                                variant="subtle"
                                color="red"
                                onClick={() => { deleteMutation.mutate(todo.id); }}
                                aria-label={`Delete todo ${todo.title}`}
                            >
                                <Text size="sm">Delete</Text>
                            </ActionIcon>
                        </Group>
                    </Card>
                ))}
            </Stack>
        </Stack>
    );
};
