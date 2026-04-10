import { Button, Card, Group, Text } from "@mantine/core";
import React from "react";

interface TodoItemProps {
    id: number;
    title: string;
    onDelete: (id: number) => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({ id, title, onDelete }) => (
    <Card withBorder radius="md" p="md">
        <Group justify="space-between" wrap="nowrap">
            <Text fw={500}>{title}</Text>
            <Button
                variant="subtle"
                color="red"
                size="sm"
                onClick={() => { onDelete(id); }}
                aria-label={`Delete todo ${title}`}
            >
                Delete
            </Button>
        </Group>
    </Card>
);
