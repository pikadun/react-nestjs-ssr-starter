import { Button, Stack, Text, Title } from "@mantine/core";
import { PageRoute } from "@shared/routes";
import React from "react";
import { Link } from "react-router";

export const Component: React.FC = () => {
    return (
        <Stack align="center" justify="center" h="100vh">
            <Title order={1}>Rsbuild with React</Title>
            <Text>Start building amazing things with Rsbuild.</Text>
            <Button component={Link} to={PageRoute.TodoList} variant="filled" size="md">
                Go to Todo
            </Button>
        </Stack>
    );
};
