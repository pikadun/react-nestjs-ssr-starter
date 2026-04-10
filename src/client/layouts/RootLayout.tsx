import "./RootLayout.css";

import React from "react";
import { Outlet } from "react-router";

export const RootLayout: React.FC = () => {
    return <Outlet />;
};
