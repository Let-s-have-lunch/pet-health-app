import { Todo } from "@/types/todo";
import { CreateTodoInputType } from "@/schemas/user/todo/createTodoSchema";
import { UpdateTodoInputType } from "@/schemas/user/todo/updateTodoSchema";
import axiosInstance from "@/api/axiosInstance";

const getTodoList = async (date: string): Promise<Todo[]> => {
    const response = await axiosInstance.get(`/pet/date`, {
        params: {
            date,
        },
    });
    return response.data.data;
};

const getTodoListByRange = async (startDate: string, endDate: string): Promise<Todo[]> => {
    const response = await axiosInstance.get(`/todo/range`, {
        params: {
            startDate,
            endDate,
        },
    });
    return response.data.data;
};

const createTodo = async (data: CreateTodoInputType): Promise<Todo> => {
    const response = await axiosInstance.post(`/todo/create`, data);
    return response.data.data;
};

const updateTodo = async (id: number, data: UpdateTodoInputType): Promise<Todo> => {
    const response = await axiosInstance.patch(`/todo/${id}`, data);
    return response.data.data;
};

const toggleTodo = async (id: number, completed: boolean): Promise<Todo> => {
    const response = await axiosInstance.patch(`/todo/${id}/toggle`, { completed });
    return response.data.data;
};

const deleteTodo = async (id: number): Promise<void> => {
    await axiosInstance.delete(`/todo/${id}`);
}

export default {
    getTodoList,
    getTodoListByRange,
    createTodo,
    updateTodo,
    toggleTodo,
    deleteTodo,
};
