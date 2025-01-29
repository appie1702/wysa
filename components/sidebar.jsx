"use client";
import React, { useEffect } from "react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import useUserStore from "@/store/user-store";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";

function Sidebar() {
  const {
    users,
    fetchUsers,
    setSelectedUser,
    currentPage,
    totalPages,
    nextPage,
    prevPage,
    selectedUser,
    isLoading,
    setSearchQuery,
    searchQuery,
  } = useUserStore();

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSearch = (e) => {
    console.log(e.target.value);
    setSearchQuery(e.target.value);
  };

  return (
    <div className="w-64 border-r bg-blue-50 border-blue-200 flex flex-col">
      <div className="px-4 mt-4 h-16 flex flex-col items-start">
        <h2 className="text-xl font-semibold mb-4 text-blue-600">Users List</h2>
      </div>
      <div className="flex-1 overflow-auto">
        <div className="p-4 space-y-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-400" />
            <Input
              type="text"
              placeholder="Search users..."
              className="pl-10 w-full"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
          {isLoading ? (
            Array(10)
              .fill(0)
              .map((_, index) => (
                <Skeleton key={index} className="h-16 w-full p-2">
                  <div className="flex flex-col w-full gap-2">
                    <Skeleton className="h-6 w-1/2" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </Skeleton>
              ))
          ) : users.length > 0 ? (
            users.map((user) => (
              <div
                key={user.id}
                className={cn(
                  "p-3 rounded-md hover:bg-blue-100 cursor-pointer transition-colors",
                  selectedUser?.id === user.id ? "bg-blue-100" : "bg-white"
                )}
                onClick={() => setSelectedUser(user.id)}
              >
                <div className="font-medium text-blue-600">
                  {user.firstName} {user.lastName}
                </div>
                <div className="text-sm text-gray-500 truncate">
                  {user.email}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500">No users found</div>
          )}
        </div>
        {!isLoading && users.length > 0 && (
          <div className="flex justify-between items-center mb-2 p-4">
            <button
              onClick={prevPage}
              disabled={currentPage === 1}
              className="p-1 rounded-md border border-blue-500 text-blue-500 hover:bg-blue-50 disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-blue-500">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={nextPage}
              disabled={currentPage === totalPages}
              className="p-1 rounded-md border border-blue-500 text-blue-500 hover:bg-blue-50 disabled:opacity-50"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Sidebar;
