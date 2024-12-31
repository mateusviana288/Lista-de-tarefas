const API_URL = "http://localhost:3001/tasks";

export const fetchTasks = async () => {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error("Erro ao buscar tarefas");
  return response.json();
};

export const addTask = async (task: { title: string; description?: string }) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  });
  if (!response.ok) throw new Error("Erro ao adicionar tarefa");
  return response.json();
};

export const deleteTask = async (id: number) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Erro ao excluir tarefa");
  return response.json();
};
