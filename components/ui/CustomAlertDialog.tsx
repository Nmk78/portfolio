"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash } from "lucide-react";
import { Project } from "@/lib/types";

interface AlertDialogProps {
  title: string;
  description: string;
  cancelText: string;
  confirmText: string;
  buttonText: string;
  buttonIcon?: React.ReactNode;
  project: Project;
  useDeleteProjectMutation: () => any; // Adjust type based on your hook
}

export default function CustomAlertDialog({
  title,
  description,
  cancelText,
  confirmText,
  buttonText,
  buttonIcon,
  project,
  useDeleteProjectMutation,
}: AlertDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  const openDialog = () => setIsOpen(true);
  const closeDialog = () => setIsOpen(false);

  const { mutate: deleteProject } = useDeleteProjectMutation();

  const handleConfirm = async () => {
    await deleteProject({ project });
    closeDialog();
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const dialogVariants = {
    hidden: { opacity: 0, scale: 0.95, y: -20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: "spring", damping: 25, stiffness: 500 },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: 20,
      transition: { duration: 0.2 },
    },
  };

  return (
    <>
      <button
        onClick={openDialog}
        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors flex items-center space-x-2"
      >
        {/* {buttonText.includes('delete') && <Trash size={16} />} */}
        {buttonIcon}
        <span>{buttonText}</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <motion.div
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={backdropVariants}
              transition={{ duration: 0.2 }}
              className="fixed  inset-0 bg-black bg-opacity-25 backdrop-blur-sm"
              onClick={closeDialog}
            />

            <div className="flex items-center justify-center min-h-screen p-4">
              <motion.div
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={dialogVariants}
                className=" border border-gray-400 bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6 relative z-50"
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <h2
                  id="alert-dialog-title"
                  className="text-lg font-semibold mb-2"
                >
                  {title}
                </h2>
                <p
                  id="alert-dialog-description"
                  className="text-gray-600 dark:text-gray-300 mb-6"
                >
                  {description}
                </p>
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={closeDialog}
                    className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                  >
                    {cancelText}
                  </button>
                  <button
                    onClick={handleConfirm}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors flex items-center space-x-2"
                  >
                    <Trash size={16} />
                    <span>{confirmText}</span>
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
