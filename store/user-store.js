import { create } from "zustand";
import { debounce } from "lodash";

const USERS_PER_PAGE = 8;

const useUserStore = create((set, get) => ({
  users: [],
  selectedUser: null,
  currentPage: 1,
  totalPages: 1,
  isLoading: true,
  error: null,
  searchQuery: "",

  fetchUsers: async (page = 1) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(
        `https://dummyjson.com/users?limit=${USERS_PER_PAGE}&skip=${
          (page - 1) * USERS_PER_PAGE
        }`
      );
      const data = await response.json();
      set({
        users: data.users,
        currentPage: page,
        totalPages: Math.ceil(data.total / USERS_PER_PAGE),
        isLoading: false,
      });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  setSelectedUser: (userId) => {
    const selectedUser = get().users.find((user) => user.id === userId);
    set({ selectedUser });
  },

  nextPage: () => {
    const { currentPage, totalPages, fetchUsers, searchUsers, searchQuery } =
      get();
    if (currentPage < totalPages) {
      if (searchQuery) {
        searchUsers(searchQuery, currentPage + 1);
      } else {
        fetchUsers(currentPage + 1);
      }
    }
  },

  prevPage: () => {
    const { currentPage, fetchUsers, searchUsers, searchQuery } = get();
    if (currentPage > 1) {
      if (searchQuery) {
        searchUsers(searchQuery, currentPage - 1);
      } else {
        fetchUsers(currentPage - 1);
      }
    }
  },

  setSearchQuery: (query) => {
    set({ searchQuery: query });
    if (query.trim() === "") {
      get().fetchUsers(1);
    } else {
      get().debouncedSearch(query);
    }
  },

  searchUsers: async (query, page = 1) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(
        `https://dummyjson.com/users/search?q=${query}&limit=${USERS_PER_PAGE}&skip=${
          (page - 1) * USERS_PER_PAGE
        }`
      );
      const data = await response.json();
      set({
        users: data.users,
        currentPage: page,
        totalPages: Math.ceil(data.total / USERS_PER_PAGE),
        isLoading: false,
      });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  updateUser: async (updatedUser) => {
    set({ error: null });
    try {
      const response = await fetch(
        `https://dummyjson.com/users/${updatedUser.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedUser),
        }
      );
      const data = await response.json();
      set((state) => ({
        users: state.users.map((user) => (user.id === data.id ? data : user)),
        selectedUser: data,
        userUpdating: false,
      }));
    } catch (error) {
      set({ error: error.message });
    }
  },

  debouncedSearch: debounce((query) => {
    get().searchUsers(query);
  }, 500),
}));

export default useUserStore;
