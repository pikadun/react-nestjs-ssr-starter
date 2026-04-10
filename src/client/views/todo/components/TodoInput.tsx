import { Button, Group, TextInput } from "@mantine/core";
import React, { useMemo, useState } from "react";

interface TodoInputProps {
    onAdd: (title: string) => void;
    isCreating: boolean;
}

export const TodoInput: React.FC<TodoInputProps> = ({ onAdd, isCreating }) => {
    const [newTitle, setNewTitle] = useState("");

    const canSubmit = useMemo(
        () => newTitle.trim().length > 0 && !isCreating,
        [newTitle, isCreating],
    );

    const handleSubmit = () => {
        if (!canSubmit) return;
        onAdd(newTitle.trim());
        setNewTitle("");
    };

    return (
        <Group align="end" wrap="nowrap">
            <TextInput
                label="New Todo"
                placeholder="What do you need to do?"
                value={newTitle}
                onChange={(event) => { setNewTitle(event.currentTarget.value); }}
                onKeyDown={(event) => {
                    if (event.key === "Enter") handleSubmit();
                }}
                flex={1}
                maxLength={120}
            />
            <Button
                onClick={handleSubmit}
                loading={isCreating}
                disabled={!canSubmit}
            >
                Add
            </Button>
        </Group>
    );
};
