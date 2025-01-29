import { create } from "zustand";
import { debounce } from "lodash";

const useTodoStore = create((set, get) => ({
  todos: [],
  isLoading: false,
  addingTodo: false,
  error: null,

  fetchTodos: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(
        `https://dummyjson.com/users/${userId}/todos`
      );
      const data = await response.json();
      set({ todos: data.todos, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  addTodo: (userId, todo) => {
    const optimisticTodo = {
      id: Date.now(),
      todo,
      completed: false,
      userId,
    };

    set((state) => ({ todos: [optimisticTodo, ...state.todos] }));

    fetch("https://dummyjson.com/todos/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        todo,
        completed: false,
        userId,
      }),
    })
      .then((response) => response.json())
      .then((newTodo) => {
        console.log({ newTodo });
        //newTodo is returning with same Id "255" when adding multiple todos, so I have commented below code to make it work!
        
        // set((state) => ({
        //   todos: state.todos.map((t) =>
        //     t.id === optimisticTodo.id ? newTodo : t
        //   ),
        // }));
      })
      .catch((error) => {
        set((state) => ({
          todos: state.todos.filter((t) => t.id !== optimisticTodo.id),
          error: error.message,
        }));
        // get().fetchTodos(userId);
      });
  },

  clearAllTodos: async (userId) => {
    const currentTodos = get().todos;
    set({ todos: [] });

    try {
      await Promise.all(
        currentTodos.map((todo) =>
          fetch(`https://dummyjson.com/todos/${todo.id}`, {
            method: "DELETE",
          })
        )
      );
    } catch (error) {
      set({ error: error.message, todos: currentTodos });
      // get().fetchTodos(userId);
    }
  },

  updateTodoLocally: (todoId, updates) => {
    set((state) => ({
      todos: state.todos.map((todo) =>
        todo.id === todoId ? { ...todo, ...updates } : todo
      ),
    }));
  },

  updateTodoAPI: debounce(async (todoId, updates) => {
    try {
      const response = await fetch(`https://dummyjson.com/todos/${todoId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
    } catch (error) {
      set({ error: error.message });
      get().fetchTodos(get().todos[0].userId);
    }
  }, 500),

  deleteTodoOptimistic: (todoId) => {
    set((state) => ({
      todos: state.todos.filter((todo) => todo.id !== todoId),
    }));

    fetch(`https://dummyjson.com/todos/${todoId}`, {
      method: "DELETE",
    }).catch((error) => {
      set({ error: error.message });
      // get().fetchTodos(get().todos[0].userId);
    });
  },

  toggleTodoCompletionOptimistic: (todoId) => {
    set((state) => ({
      todos: state.todos.map((todo) =>
        todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
      ),
    }));

    const updatedTodo = get().todos.find((todo) => todo.id === todoId);
    fetch(`https://dummyjson.com/todos/${todoId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: updatedTodo.completed }),
    })
      .then((response) => response.json())
      .catch((error) => {
        set({ error: error.message });
        // get().fetchTodos(get().todos[0].userId);
      });
  },
}));

export default useTodoStore;
