import { Button, Stack, Text, Title } from "@mantine/core";
import React from "react";

export const Component: React.FC = () => {
    return (
        <Stack align="center" justify="center" h="100vh">
            <Title order={1}>Rsbuild with React</Title>
            <Text>Start building amazing things with Rsbuild.</Text>
            <Button variant="filled" size="md">
                Get Started
            </Button>
        </Stack>
    );
};
