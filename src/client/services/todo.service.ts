import type { ListTodosResponse } from "@shared/schemas/todo.schema";
import axios from "axios";

const baseElement = document.querySelector("base");
const baseURL = baseElement?.getAttribute("href") ?? "/";
const httpClient = axios.create({ baseURL });

export const getList = async () => {
    const { data } = await httpClient.get<ListTodosResponse>("/api/todo");

    return data;
};
