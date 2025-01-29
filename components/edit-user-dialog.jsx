import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

export function EditUserDialog({ isOpen, onClose, user, onUpdate, section }) {
  const [editedUser, setEditedUser] = useState(user);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setEditedUser(user);
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNestedInputChange = (e, nestedKey) => {
    const { name, value } = e.target;
    setEditedUser((prev) => ({
      ...prev,
      [nestedKey]: {
        ...prev[nestedKey],
        [name]: value,
      },
    }));
  };

  const handleUpdate = async () => {
    setIsLoading(true);
    await onUpdate(editedUser);
    setIsLoading(false);
    onClose();
  };

  const renderFields = () => {
    switch (section) {
      case "Personal Information":
        return (
          <>
            <DialogTitle className="text-blue-600">
              Edit Personal Information
            </DialogTitle>
            <div className="grid gap-4 py-4">
              {["firstName", "lastName", "email", "phone", "birthDate"].map(
                (field) => (
                  <div
                    key={field}
                    className="grid grid-cols-4 items-center gap-4"
                  >
                    <Label htmlFor={field} className="text-right text-blue-500">
                      {field.charAt(0).toUpperCase() + field.slice(1)}
                    </Label>
                    <input
                      id={field}
                      name={field}
                      value={editedUser[field]}
                      onChange={handleInputChange}
                      className="col-span-3 p-2 w-full rounded-md border border-blue-200 focus:border-blue-200 focus:ring-blue-200 focus:ring-1 focus:outline-none flex-1"
                    />
                  </div>
                )
              )}
            </div>
          </>
        );
      case "Address":
        return (
          <>
            <DialogTitle className="text-blue-600">Edit Address</DialogTitle>
            <div className="grid gap-4 py-4">
              {["address", "city", "state", "postalCode"].map((field) => (
                <div
                  key={field}
                  className="grid grid-cols-4 items-center gap-4"
                >
                  <Label htmlFor={field} className="text-right text-blue-500">
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </Label>
                  <input
                    id={field}
                    name={field}
                    value={editedUser.address[field]}
                    onChange={(e) => handleNestedInputChange(e, "address")}
                    className="col-span-3 p-2 w-full rounded-md border border-blue-200 focus:border-blue-200 focus:ring-blue-200 focus:ring-1 focus:outline-none flex-1"
                  />
                </div>
              ))}
            </div>
          </>
        );
      case "Company":
        return (
          <>
            <DialogTitle className="text-blue-600">
              Edit Company Information
            </DialogTitle>
            <div className="grid gap-4 py-4">
              {["name", "title", "department"].map((field) => (
                <div
                  key={field}
                  className="grid grid-cols-4 items-center gap-4"
                >
                  <Label htmlFor={field} className="text-right text-blue-500">
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </Label>
                  <input
                    id={field}
                    name={field}
                    value={editedUser.company[field]}
                    onChange={(e) => handleNestedInputChange(e, "company")}
                    className="col-span-3 p-2 w-full rounded-md border border-blue-200 focus:border-blue-200 focus:ring-blue-200 focus:ring-1 focus:outline-none flex-1"
                  />
                </div>
              ))}
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>{renderFields()}</DialogHeader>
        <DialogFooter>
          <Button
            type="submit"
            onClick={handleUpdate}
            disabled={isLoading}
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Update"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
