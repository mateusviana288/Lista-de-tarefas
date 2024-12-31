"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import "../app/globals.css";

const taskSchema = z.object({
  title: z
    .string()
    .min(1, "Título é obrigatório")
    .max(50, "Título não pode ter mais que 50 caracteres"),
  description: z
    .string()
    .max(200, "Descrição não pode ter mais que 200 caracteres")
    .optional(),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface TaskFormProps {
  onSubmit: (task: TaskFormData) => void;
  initialData?: { title: string; description?: string };
}

const TaskForm: React.FC<TaskFormProps> = ({ onSubmit, initialData }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
  });

  useEffect(() => {
    if (initialData) {
      setValue("title", initialData.title);
      setValue("description", initialData.description || "");
    }
  }, [initialData, setValue]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-lg font-medium text-black mb-1">
          Título
        </label>
        <input id="title" className="w-full p-2 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition duration-300" {...register("title")}/>
        {errors.title && (
          <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-lg font-medium text-black mb-1">
          Descrição
        </label>
        <textarea id="description" className="w-full p-2 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition duration-300"{...register("description")}/>
        {errors.description && (
          <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
        )}
      </div>

      <button type="submit" className="w-full px-6 py-3 bg-gray-700 text-white font-medium rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition duration-300">
        {initialData ? "Salvar" : "Adicionar Tarefa"}
      </button>
    </form>
  );
};

export default TaskForm;



