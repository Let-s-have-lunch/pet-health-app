import { Todo } from "@/types/todo";
import { CreateTodoInputType } from "@/schemas/user/todo/createTodoSchema";
import { UpdateTodoInputType } from "@/schemas/user/todo/updateTodoSchema";
import axiosInstance from "@/api/axiosInstance";
import { TodoFormInputType } from "@/schemas/todo/todoFormSchema";

const getTodoList = async (date: string): Promise<Todo[]> => {
    const response = await axiosInstance.get(`/todo/list`, {
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

const createTodo = async (payload: { date: Date; title: string }): Promise<Todo> => {
    const response = await axiosInstance.post(`/todo/create`, payload);
    return response.data.data;
};

const updateTodo = async (id: number, payload: { date: Date; title: string }): Promise<Todo> => {
    const response = await axiosInstance.patch(`/todo/${id}`, payload);
    return response.data.data;
};

const toggleTodo = async (id: number): Promise<Todo> => {
    const response = await axiosInstance.patch(`/todo/${id}/toggle`);
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
