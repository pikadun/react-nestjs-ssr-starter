import type { ListTodosResponse } from "@shared/schemas/todo.schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
    createTodoItem,
    deleteTodoItem,
    listTodos,
    todoQueryKeys,
} from "../../../services/todo";

export function useTodos() {
    const queryClient = useQueryClient();

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

    const error
        = queryError?.message
            ?? createMutation.error?.message
            ?? deleteMutation.error?.message
            ?? null;

    return {
        todos,
        error,
        refetch,
        isRefetching,
        createTodo: createMutation.mutate,
        isCreating: createMutation.isPending,
        deleteTodo: deleteMutation.mutate,
    };
}
