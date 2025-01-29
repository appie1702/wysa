"use client";

import React, { useEffect, useState } from "react";
import { Loader2, Pencil, Trash2 } from "lucide-react";
import useUserStore from "@/store/user-store";
import useTodoStore from "@/store/todo-store";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Skeleton } from "./ui/skeleton";
import { useToast } from "@/hooks/use-toast";

function TodoList() {
  const { toast } = useToast();
  const selectedUser = useUserStore((state) => state.selectedUser);
  const isLoadingUser = useUserStore((state) => state.isLoading);

  const {
    todos,
    isLoading,
    fetchTodos,
    addTodo,
    updateTodoLocally,
    updateTodoAPI,
    deleteTodoOptimistic,
    toggleTodoCompletionOptimistic,
    clearAllTodos,
    addingTodo,
  } = useTodoStore();

  const [newTodo, setNewTodo] = useState("");
  const [editingTodo, setEditingTodo] = useState(null);

  useEffect(() => {
    if (selectedUser) {
      fetchTodos(selectedUser.id);
    }
  }, [selectedUser, fetchTodos]);

  const handleAddTodo = async () => {
    if (newTodo.trim()) {
      await addTodo(selectedUser.id, newTodo);
      setNewTodo("");
      toast({
        title: "Task Added!",
      });
    }
  };

  const handleClearAll = async () => {
    await clearAllTodos(selectedUser.id);
    toast({
      title: "All tasks removed!",
    });
  };

  const handleUpdateTodo = (todoId, updates) => {
    updateTodoLocally(todoId, updates);
    updateTodoAPI(todoId, updates);
  };

  const handleDeleteTodo = (todoId) => {
    deleteTodoOptimistic(todoId);
    toast({
      title: "Task Deleted!",
    });
  };

  const handleToggleCompletion = (isCompleted, todoId) => {
    toggleTodoCompletionOptimistic(todoId);
    if (!isCompleted) {
      toast({
        title: "Task Completed!",
      });
    }
  };

  if (!selectedUser) {
    return (
      <div className="text-center text-gray-500 h-full flex-1 w-full flex items-center justify-center">
        Select a user to view details
      </div>
    );
  }

  return (
    <div className="space-y-8 h-full flex-1 w-full">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-blue-600">
          Todos for {selectedUser.firstName} {selectedUser.lastName}
        </h2>
        <div className="space-y-4">
          <div className="relative">
            <input
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value.slice(0, 150))}
              placeholder="Add a new to-do..."
              className="pr-16 pl-4 py-4 w-full rounded-md border border-blue-200 focus:border-blue-200 focus:ring-blue-200 focus:ring-1 focus:outline-none flex-1"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
              {newTodo.length}/150
            </span>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleClearAll}
              className="border-blue-100 text-blue-600 hover:bg-blue-50"
            >
              Clear
            </Button>
            <Button
              onClick={handleAddTodo}
              className="bg-blue-600 text-white hover:bg-blue-700"
              disabled={!newTodo.trim()}
            >
              Add To-do
            </Button>
          </div>
        </div>
      </div>

      {selectedUser && todos.length === 0 && !isLoadingUser && !isLoading ? (
        <div className="text-center text-gray-500">
          No todos found for {selectedUser.firstName} {selectedUser.lastName}
        </div>
      ) : isLoading ? (
        <div className="space-y-2">
          {Array(5)
            .fill(0)
            .map((_, index) => (
              <Skeleton key={index} className="h-14 w-full" />
            ))}
        </div>
      ) : (
        <div className="space-y-2">
          {todos.map((todo) => (
            <div
              key={todo.id}
              className="bg-white rounded-lg shadow-sm p-4 border border-gray-200 flex items-center gap-3"
            >
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => handleToggleCompletion(todo.completed, todo.id)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              {editingTodo === todo.id ? (
                <Input
                  value={todo.todo}
                  onChange={(e) =>
                    handleUpdateTodo(todo.id, { todo: e.target.value })
                  }
                  onBlur={() => setEditingTodo(null)}
                  autoFocus
                  className="flex-1"
                />
              ) : (
                <span
                  className={`flex-1 text-gray-900 ${
                    todo.completed ? "line-through" : ""
                  }`}
                >
                  {todo.todo}
                </span>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setEditingTodo(todo.id)}
                className="text-gray-500 hover:text-blue-600"
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDeleteTodo(todo.id)}
                className="text-gray-500 hover:text-red-600"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TodoList;
