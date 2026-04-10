import { Alert, Button, Group, Stack, Title } from "@mantine/core";
import type { RouteHandle } from "@shared/types/route";
import React from "react";

import { todoQueryKeys } from "../../services/todo";
import { TodoInput } from "./components/TodoInput";
import { TodoList } from "./components/TodoList";
import { useTodos } from "./hooks/useTodos";

// eslint-disable-next-line react-refresh/only-export-components
export const handle: RouteHandle = {
    hydrate: (queryClient, data) => {
        queryClient.setQueryData(todoQueryKeys.list(), data);
    },
};

export const Component: React.FC = () => {
    const {
        todos,
        error,
        refetch,
        isRefetching,
        createTodo,
        isCreating,
        deleteTodo,
    } = useTodos();

    return (
        <Stack align="center" justify="flex-start" py={48} px={16} mih="100vh" gap="lg">
            <Stack w="100%" maw={680} gap="md">
                <Group justify="space-between" align="end">
                    <Title order={2}>Todo List</Title>
                    <Button variant="light" onClick={() => void refetch()} loading={isRefetching}>
                        Refresh
                    </Button>
                </Group>

                <TodoInput onAdd={createTodo} isCreating={isCreating} />

                {error ? <Alert color="red">{error}</Alert> : null}

                <TodoList todos={todos} onDelete={deleteTodo} />
            </Stack>
        </Stack>
    );
};
