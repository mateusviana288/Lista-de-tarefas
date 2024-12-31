"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import TaskForm from "../components/TaskForm";
import "./globals.css";

type Task = {
  id?: number;
  title: string;
  description?: string;
};

const fetchTasks = async (): Promise<Task[]> => {
  const response = await fetch("http://localhost:3001/tasks");
  if (!response.ok) throw new Error("Erro ao buscar tarefas");
  return response.json();
};

const addTask = async (task: Task): Promise<Task> => {
  const response = await fetch("http://localhost:3001/tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  });
  if (!response.ok) throw new Error("Erro ao adicionar tarefa");
  return response.json();
};

const deleteTask = async (id: number): Promise<void> => {
  const response = await fetch(`http://localhost:3001/tasks/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Erro ao excluir tarefa");
};

const updateTask = async (task: Task): Promise<Task> => {
  const response = await fetch(`http://localhost:3001/tasks/${task.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  });
  if (!response.ok) throw new Error("Erro ao atualizar tarefa");
  return response.json();
};

const Page: React.FC = () => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const queryClient = useQueryClient();

  const { data: tasks = [], isLoading, isError, error } = useQuery({
    queryKey: ["tasks"],
    queryFn: fetchTasks,
  });

  const { mutate: addTaskMutate } = useMutation({
    mutationFn: addTask,
    onSuccess: (newTask) => {
      queryClient.setQueryData(["tasks"], (oldTasks: Task[]) => [...oldTasks, newTask]);
    },
  });

  const { mutate: deleteTaskMutate } = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });

  const { mutate: updateTaskMutate } = useMutation({
    mutationFn: updateTask,
    onSuccess: (updatedTask) => {
      queryClient.setQueryData(
        ["tasks"],
        (oldTasks: Task[]) =>
          oldTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
      );
    },
  });

  const handleAddTask = (task: Task) => addTaskMutate(task);

  const handleDeleteTask = (id: number | undefined) => {
    if (id) deleteTaskMutate(id);
  };

  const handleEditTask = (task: Task) => setSelectedTask(task);

  const handleUpdateTask = (task: Task) => {
    if (selectedTask?.id) {
      updateTaskMutate({ id: selectedTask.id, ...task });
      setSelectedTask(null);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const filteredTasks = tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (isLoading) return <div>Carregando...</div>;
  if (isError) return <div>Erro ao carregar tarefas: {error instanceof Error && error.message}</div>;

  return (
    <div>
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Pesquisar tarefas"
          className="w-full p-3 pl-10 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition duration-300"/>
        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-5 h-5">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-4.35-4.35M17 10a7 7 0 1 0-7 7 7 7 0 0 0 7-7z"/>
          </svg>
        </span>
      </div>
      <TaskForm onSubmit={selectedTask ? handleUpdateTask : handleAddTask} initialData={selectedTask || undefined} />
      <ul className="space-y-4">
        {Array.isArray(filteredTasks) &&
          filteredTasks.map((task) => (
            <li key={task.id} className="flex justify-between items-center bg-gray-100 p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300">
              <div className="flex flex-col space-y-1">
                <span className="font-semibold text-lg text-gray-900">{task.title}</span>
                <span className="text-gray-600 text-sm">{task.description}</span>
              </div>
              <div className="flex space-x-2">
                <button 
                  className="px-3 py-1 text-sm bg-red-600 text-white font-light rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition duration-300"
                  onClick={() => handleDeleteTask(task.id)}>
                  Excluir
                </button>
                <button 
                  className="px-3 py-1 text-sm bg-gray-600 text-white font-light rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition duration-300"onClick={() => handleEditTask(task)}>
                  Editar
                </button>
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default Page;
