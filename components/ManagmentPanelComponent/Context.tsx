"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, Loader2, Pencil } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Context } from "@/lib/types";

// Fetching context function
const fetchContext = async (): Promise<Context> => {
  const response = await fetch("/api/chatcontext");
  if (!response.ok) throw new Error("Failed to fetch context");
  return response.json();
};

// Updating context function
const updateContext = async (context: Context): Promise<Context> => {
  const response = await fetch("/api/chatcontext", {
    method: context.id ? "PUT" : "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(context),
  });
  if (!response.ok) throw new Error("Failed to save context");
  return response.json();
};

export default function ContextManager() {
  const [isOpen, setIsOpen] = useState(false);
  const [editableContent, setEditableContent] = useState("");

  const queryClient = useQueryClient();

  // Fix: Pass query key and function inside an object
  const {
    data: context,
    isLoading,
    error,
  } = useQuery<Context, Error>({
    queryKey: ["context"], // The query key goes here
    queryFn: fetchContext, // The query function goes here
  });

  const mutation = useMutation({
    mutationFn: async (context: Context) => updateContext(context), // Mutation function

    onSuccess: async () => {
      console.log("Invalidating context");
      await queryClient.invalidateQueries({ queryKey: ["context"] });
      await queryClient.refetchQueries({
        queryKey: ["context"], // Refetch using the same array structure
        type: "active", // Only refetch active queries
        exact: true,
      });
      setIsOpen(false);
    },

    onError: (error: any) => {
      console.error("Error updating context:", error);
    },
  });

  const handleEdit = () => {
    setEditableContent(context?.content || "");
    setIsOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ id: context?.id, content: editableContent });
  };

  if (isLoading)
    return (
      <div className="flex items-center space-x-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Loading context...</span>
      </div>
    );

  if (error)
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    );

  return (
    <div className="relative inline-block">
      <div
        className="flex items-center space-x-2 cursor-pointer"
        onClick={handleEdit}
      >
        <span className="max-w-[20ch] truncate">
          {context?.content || "No context set"}
        </span>
        <Pencil className="h-4 w-4" />
      </div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="bg-gray-100">
          <DialogHeader>
            <DialogTitle>Edit Context</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <Textarea
                value={editableContent}
                onChange={(e) => setEditableContent(e.target.value)}
                rows={10}
                placeholder="Enter context here..."
              />
            </div>
            <DialogFooter>
              <Button variant="outline" className="" type="submit" disabled={mutation.isPending}>
                {mutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
