"use client";

import React, { useState } from "react";
import { Pencil } from "lucide-react";
import useUserStore from "@/store/user-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { EditUserDialog } from "./edit-user-dialog";

function UserDetails() {
  const selectedUser = useUserStore((state) => state.selectedUser);
  const updateUser = useUserStore((state) => state.updateUser);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editSection, setEditSection] = useState(null);

  console.log(selectedUser);

  if (!selectedUser) {
    return (
      <div className="text-center text-gray-500 h-full flex-1 w-full flex items-center justify-center">
        Select a user to view details
      </div>
    );
  }

  const handleEditClick = (section) => {
    setEditSection(section);
    setIsDialogOpen(true);
  };

  const handleUpdate = async (updatedUser) => {
    await updateUser(updatedUser);
  };

  const sections = [
    {
      title: "Personal Information",
      fields: ["firstName", "lastName", "email", "phone", "birthDate"],
    },
    {
      title: "Address",
      fields: [
        "address.address",
        "address.city",
        "address.state",
        "address.postalCode",
      ],
    },
    {
      title: "Company",
      fields: ["company.name", "company.title", "company.department"],
    },
  ];

  return (
    <div className="space-y-6 h-full flex-1 w-full">
      <Card className="border-blue-200">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-blue-600">
              {selectedUser.firstName} {selectedUser.lastName}
            </h2>
            <p className="text-blue-400">
              {selectedUser.address.city}, {selectedUser.address.state}
            </p>
          </div>
        </CardHeader>
      </Card>

      {sections.map((section) => (
        <Card key={section.title} className="border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between">
            <h3 className="text-lg font-semibold text-blue-600">
              {section.title}
            </h3>
            <Button
              variant="outline"
              size="icon"
              className="text-blue-500 hover:text-blue-600 hover:bg-blue-50"
              onClick={() => handleEditClick(section.title)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {section.fields.map((field) => (
                <div key={field} className="flex flex-col">
                  <span className="text-sm text-gray-400">
                    {field.split(".").pop()}
                  </span>
                  <span className="text-sm text-gray-800">
                    {field
                      .split(".")
                      .reduce((obj, key) => obj[key], selectedUser)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      <EditUserDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        user={selectedUser}
        onUpdate={handleUpdate}
        section={editSection}
      />
    </div>
  );
}

export default UserDetails;
