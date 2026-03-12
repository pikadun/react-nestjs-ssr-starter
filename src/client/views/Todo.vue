<template>
    <div style="display: flex; justify-content: center; padding: 2rem">
        <Card style="width: 600px">
            <template #title>Todo List</template>
            <template #subtitle>共 {{ todos.length }} 项</template>
            <template #content>
                <form @submit.prevent="handleCreate" style="display: flex; gap: 0.5rem; margin-bottom: 1rem">
                    <InputText
                        v-model="draftTitle"
                        maxlength="120"
                        placeholder="输入待办内容"
                        :disabled="isCreating"
                        fluid
                    />
                    <Button
                        type="submit"
                        label="添加"
                        :loading="isCreating"
                        :disabled="isCreateDisabled"
                    />
                </form>

                <Message v-if="errorMessage" severity="error" :closable="false">
                    {{ errorMessage }}
                </Message>

                <div v-if="isLoading" style="display: flex; align-items: center; gap: 0.5rem; justify-content: center">
                    <ProgressSpinner style="width: 24px; height: 24px" strokeWidth="4" />
                    <span>正在加载...</span>
                </div>

                <div v-else-if="todos.length > 0" style="display: flex; flex-direction: column; gap: 0.5rem">
                    <Card v-for="todo in todos" :key="todo.id">
                        <template #content>
                            <div style="display: flex; justify-content: space-between; align-items: center">
                                <div style="display: flex; align-items: center; gap: 0.5rem">
                                    <Checkbox :modelValue="todo.completed" :binary="true" disabled />
                                    <span :style="todo.completed ? 'text-decoration: line-through; opacity: 0.5' : ''">
                                        {{ todo.title }}
                                    </span>
                                </div>
                                <Button
                                    severity="secondary"
                                    outlined
                                    size="small"
                                    :label="deletingId === todo.id ? '删除中...' : '删除'"
                                    :loading="deletingId === todo.id"
                                    :disabled="deletingId === todo.id"
                                    @click="handleDelete(todo.id)"
                                />
                            </div>
                        </template>
                    </Card>
                </div>

                <div v-else style="text-align: center; opacity: 0.6; padding: 2rem 0">
                    还没有待办事项，先添加一条吧。
                </div>
            </template>
        </Card>
    </div>
</template>

<script setup lang="ts">
import { SSR_DATA_KEY } from "@shared/ssr-data";
import { computed, inject, onMounted, ref } from "vue";

defineOptions({
    name: "TodoView",
});

interface TodoItem {
    id: number;
    title: string;
    completed: boolean;
}

type AnyObject = Record<string, unknown>;

const isObject = (value: unknown): value is AnyObject => {
    return typeof value === "object" && value !== null;
};

const unwrapData = (value: unknown): unknown => {
    if (isObject(value) && "data" in value) {
        return value.data;
    }
    return value;
};

const toTodoItem = (value: unknown): TodoItem | null => {
    if (!isObject(value)) {
        return null;
    }
    const id = value.id;
    const title = value.title;
    if (typeof id !== "number" || typeof title !== "string") {
        return null;
    }
    return { id, title, completed: Boolean(value.completed) };
};

const parseTodoList = (value: unknown): TodoItem[] => {
    const data = unwrapData(value);
    if (!Array.isArray(data)) {
        return [];
    }
    return data.map(toTodoItem).filter((item): item is TodoItem => item !== null);
};

const ssrData = inject(SSR_DATA_KEY, undefined);

const todos = ref<TodoItem[]>(parseTodoList(ssrData));
const draftTitle = ref("");
const isLoading = ref(false);
const isCreating = ref(false);
const deletingId = ref<number | null>(null);
const errorMessage = ref("");

const isCreateDisabled = computed(() => {
    return isCreating.value || draftTitle.value.trim().length === 0;
});

const getApiUrl = (path: string): string => {
    const normalizedPath = path.startsWith("/") ? path.slice(1) : path;
    return normalizedPath;
};

const fetchTodos = async () => {
    isLoading.value = true;
    errorMessage.value = "";
    try {
        const response = await fetch(getApiUrl("/api/todo"), {
            method: "GET",
            headers: { accept: "application/json" },
        });
        if (!response.ok) {
            throw new Error(`Request failed: ${response.status}`);
        }
        const payload: unknown = await response.json();
        todos.value = parseTodoList(payload);
    }
    catch {
        errorMessage.value = "加载失败，请稍后重试。";
    }
    finally {
        isLoading.value = false;
    }
};

const handleCreate = async () => {
    const title = draftTitle.value.trim();
    if (!title || isCreating.value) {
        return;
    }
    isCreating.value = true;
    errorMessage.value = "";
    try {
        const response = await fetch(getApiUrl("/api/todo"), {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ title }),
        });
        if (!response.ok) {
            throw new Error(`Request failed: ${response.status}`);
        }
        draftTitle.value = "";
        await fetchTodos();
    }
    catch {
        errorMessage.value = "添加失败，请稍后重试。";
    }
    finally {
        isCreating.value = false;
    }
};

const handleDelete = async (id: number) => {
    if (deletingId.value !== null) {
        return;
    }
    deletingId.value = id;
    errorMessage.value = "";
    try {
        const response = await fetch(getApiUrl(`/api/todo/${id}`), {
            method: "DELETE",
            headers: { accept: "application/json" },
        });
        if (!response.ok) {
            throw new Error(`Request failed: ${response.status}`);
        }
        todos.value = todos.value.filter(todo => todo.id !== id);
    }
    catch {
        errorMessage.value = "删除失败，请稍后重试。";
    }
    finally {
        deletingId.value = null;
    }
};

onMounted(() => {
    if (ssrData === undefined) {
        void fetchTodos();
    }
});
</script>
