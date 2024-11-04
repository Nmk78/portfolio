"use client";

import { formatFileSize } from "@edgestore/react/utils";
import {
  CheckCircleIcon,
  FileIcon,
  LucideFileWarning,
  Trash2Icon,
  UploadCloudIcon,
  XIcon,
} from "lucide-react";
import * as React from "react";
import { useDropzone, type DropzoneOptions } from "react-dropzone";
import { twMerge } from "tailwind-merge";

const variants = {
  base: "relative  rounded-lg p-4 w-full flex justify-center items-center flex-col cursor-pointer border border-dashed border-gray-400 dark:border-gray-300 transition-colors duration-200 ease-in-out",
  active: "border-2",
  disabled:
    "bg-gray-200 border-gray-300 cursor-default pointer-events-none bg-opacity-30 dark:bg-gray-700 dark:border-gray-600",
  accept: "border border-blue-500 bg-blue-500 bg-opacity-10",
  reject: "border border-red-700 bg-red-700 bg-opacity-10",
};

export type FileState = {
  file: File;
  key: string; // used to identify the file in the progress callback
  progress: "PENDING" | "COMPLETE" | "ERROR" | number;
  abortController?: AbortController;
};

type InputProps = {
  className?: string;
  value?: FileState[];
  onChange?: (files: FileState[]) => void | Promise<void>;
  onFilesAdded?: (addedFiles: FileState[]) => void | Promise<void>;
  disabled?: boolean;
  dropzoneOptions?: Omit<DropzoneOptions, "disabled">;
};

const ERROR_MESSAGES = {
  fileTooLarge(maxSize: number) {
    return `The file is too large. Max size is ${formatFileSize(maxSize)}.`;
  },
  fileInvalidType() {
    return "Invalid file type.";
  },
  tooManyFiles(maxFiles: number) {
    return `You can only add ${maxFiles} file(s).`;
  },
  fileNotSupported() {
    return "The file is not supported.";
  },
};

const MultiFileDropzone = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { dropzoneOptions, value, className, disabled, onFilesAdded, onChange },
    ref
  ) => {
    const [customError, setCustomError] = React.useState<string>();
    if (dropzoneOptions?.maxFiles && value?.length) {
      disabled = disabled ?? value.length >= dropzoneOptions.maxFiles;
    }
    // dropzone configuration
    const {
      getRootProps,
      getInputProps,
      fileRejections,
      isFocused,
      isDragAccept,
      isDragReject,
    } = useDropzone({
      disabled,
      onDrop: (acceptedFiles) => {
        const files = acceptedFiles;
        setCustomError(undefined);
        if (
          dropzoneOptions?.maxFiles &&
          (value?.length ?? 0) + files.length > dropzoneOptions.maxFiles
        ) {
          setCustomError(ERROR_MESSAGES.tooManyFiles(dropzoneOptions.maxFiles));
          return;
        }
        if (files) {
          const addedFiles = files.map<FileState>((file) => ({
            file,
            key: "nmk",
            progress: "PENDING",
          }));
          void onFilesAdded?.(addedFiles);
          void onChange?.([...(value ?? []), ...addedFiles]);
        }
      },
      ...dropzoneOptions,
    });

    // styling
    const dropZoneClassName = React.useMemo(
      () =>
        twMerge(
          variants.base,
          isFocused && variants.active,
          disabled && variants.disabled,
          (isDragReject ?? fileRejections[0]) && variants.reject,
          isDragAccept && variants.accept,
          className
        ).trim(),
      [
        isFocused,
        fileRejections,
        isDragAccept,
        isDragReject,
        disabled,
        className,
      ]
    );

    // error validation messages
    const errorMessage = React.useMemo(() => {
      if (fileRejections[0]) {
        const { errors } = fileRejections[0];
        if (errors[0]?.code === "file-too-large") {
          return ERROR_MESSAGES.fileTooLarge(dropzoneOptions?.maxSize ?? 0);
        } else if (errors[0]?.code === "file-invalid-type") {
          return ERROR_MESSAGES.fileInvalidType();
        } else if (errors[0]?.code === "too-many-files") {
          return ERROR_MESSAGES.tooManyFiles(dropzoneOptions?.maxFiles ?? 0);
        } else {
          return ERROR_MESSAGES.fileNotSupported();
        }
      }
      return undefined;
    }, [fileRejections, dropzoneOptions]);

    return (
      <div className="w-full">
        <div className="flex w-full flex-col gap-2">
          <div className="w-full flex flex-col items-center">
            {/* Main File Input */}
            {value?.length == 0 && (
              <div
                {...getRootProps({
                  className: dropZoneClassName,
                })}
              >
                <input ref={ref} {...getInputProps()} />
                <div className="flex flex-col items-center justify-center text-xs text-gray-400">
                  <UploadCloudIcon className="mb-1 h-7 w-7" />
                  <div className="text-gray-400">
                    drag & drop or click to update
                  </div>
                </div>
              </div>
            )}

            {/* Error Text */}
            <div className="mt-1 text-xs text-red-500">
              {customError ?? errorMessage}
            </div>
          </div>

          {/* Selected Files */}
          {value?.map(({ file, abortController, progress }, i) => (
            <div
              key={i}
              className="flex h-16 w-full flex-col justify-center rounded-lg border border-gray-300 bg-white shadow-sm transition-all duration-200 ease-in-out hover:shadow-md dark:border-gray-600 dark:bg-gray-800"
            >
              <div className="flex px-2 items-center gap-2 text-gray-600 dark:text-gray-300">
                <FileIcon size="30" className="shrink-0" />
                <div className="min-w-0 flex-1 text-sm">
                  <div className=" w-4/5 overflow-hidden overflow-ellipsis whitespace-nowrap font-medium text-gray-800 dark:text-gray-100">
                    {file.name.length > 23
                      ? `${file.name.slice(0, 23)}...`
                      : file.name}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {formatFileSize(file.size)}
                  </div>
                </div>
                <div className="grow" />
                <div className="flex w-12 justify-end text-xs">
                  {progress === "PENDING" ? (
                    <button
                      type="button"
                      className="rounded-md p-1 transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => {
                        void onChange?.(
                          value.filter((_, index) => index !== i)
                        );
                      }}
                    >
                      <Trash2Icon className="shrink-0 text-red-600 dark:text-red-400" />
                    </button>
                  ) : progress === "ERROR" ? (
                    <LucideFileWarning className="shrink-0 text-red-600 dark:text-red-400" />
                  ) : progress !== "COMPLETE" ? (
                    <div className="flex flex-col items-end gap-0.5">
                      {abortController && (
                        <button
                          type="button"
                          className="rounded-md p-0.5 transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                          disabled={progress === 100}
                          onClick={() => {
                            abortController.abort();
                          }}
                        >
                          <XIcon className="h-4 w-4 shrink-0 text-gray-400 dark:text-gray-400" />
                        </button>
                      )}
                      <div className="text-gray-600 dark:text-gray-300">
                        {Math.round(progress)}%
                      </div>
                    </div>
                  ) : (
                    <CheckCircleIcon className="shrink-0 text-green-600 dark:text-green-400" />
                  )}
                </div>
              </div>
              {/* Progress Bar */}
              {typeof progress === "number" && (
                <div className="relative h-2 mt-1">
                  <div className="absolute top-0 h-1 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                    <div
                      className="h-full bg-blue-500 transition-all duration-300 ease-in-out dark:bg-blue-300"
                      style={{
                        width: progress ? `${progress}%` : "0%",
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }
);
MultiFileDropzone.displayName = "MultiFileDropzone";

export { MultiFileDropzone };
