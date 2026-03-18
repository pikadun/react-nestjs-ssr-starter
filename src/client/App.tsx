import "./App.css";

import { MantineProvider } from "@mantine/core";
import React from "react";
import { Outlet } from "react-router";

export const App: React.FC = () => {
    return (
        <MantineProvider defaultColorScheme="auto">
            <Outlet />
        </MantineProvider>
    );
};
