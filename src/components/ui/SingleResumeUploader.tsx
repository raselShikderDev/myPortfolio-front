"use client";

import { useEffect, type Dispatch } from "react";
import {
    AlertCircle,
    FileText,
    Upload,
    X,
    FileCheck2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { FileMetadata, useFileUpload } from "@/hooks/use-file-uploader";

interface SingleResumeUploaderProps {
    onChange: Dispatch<React.SetStateAction<(File | FileMetadata)[]>>;
    initialFiles?: FileMetadata[];
    className?: string;
}

export default function SingleResumeUploader({
    onChange,
    initialFiles = [],
    className = "",
}: SingleResumeUploaderProps) {
    const maxSizeMB = 5;
    const maxSize = maxSizeMB * 1024 * 1024;

    const [
        { files, isDragging, errors },
        {
            handleDragEnter,
            handleDragLeave,
            handleDragOver,
            handleDrop,
            openFileDialog,
            removeFile,
            getInputProps,
        },
    ] = useFileUpload({
        accept: "application/pdf,.pdf",
        maxSize,
        multiple: false,
        maxFiles: 1,
        initialFiles,
    });

    useEffect(() => {
        onChange(files.map((item) => item.file));
    }, [files, onChange]);

    const selectedFile = files[0];

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024 * 1024) {
            return `${(bytes / 1024).toFixed(1)} KB`;
        }

        return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    };

    return (
        <div className={`w-full space-y-3 ${className}`}>
            {/* Upload Area */}
            <div
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                data-dragging={isDragging || undefined}
                className={`
          relative flex min-h-[190px] w-full flex-col items-center
          justify-center overflow-hidden rounded-xl border-2
          border-dashed p-5 text-center transition-all duration-200
          sm:min-h-[220px] sm:p-8
          ${isDragging
                        ? "border-primary bg-primary/5"
                        : "border-muted-foreground/25 bg-muted/20 hover:border-primary/50 hover:bg-muted/40"
                    }
        `}
            >
                <input
                    {...getInputProps()}
                    className="sr-only cursor-pointer"
                    aria-label="Upload resume PDF"
                />

                {selectedFile ? (
                    /* Selected Resume */
                    <div className="flex w-full max-w-md flex-col items-center gap-4">
                        <div className="flex size-14 items-center justify-center rounded-xl bg-primary/10 text-primary sm:size-16">
                            <FileCheck2 className="size-7 sm:size-8" />
                        </div>

                        <div className="w-full min-w-0 space-y-1">
                            <p className="text-sm font-semibold">
                                Resume selected successfully
                            </p>

                            <div className="mx-auto flex max-w-full items-center justify-center gap-2">
                                <FileText className="size-4 shrink-0 text-muted-foreground" />

                                <p className="truncate text-sm text-muted-foreground">
                                    {selectedFile.file.name}
                                </p>
                            </div>

                            <p className="text-xs text-muted-foreground">
                                {formatFileSize(selectedFile.file.size)} · PDF document
                            </p>
                        </div>

                        <div className="flex w-full flex-col justify-center gap-2 sm:flex-row">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={openFileDialog}
                                className="w-full sm:w-auto cursor-pointer"
                            >
                                <Upload className="mr-2 size-4" />
                                Replace PDF
                            </Button>

                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFile(selectedFile.id)}
                                className="w-full text-destructive hover:bg-destructive/10 hover:text-destructive sm:w-auto cursor-pointer"
                            >
                                <X className="mr-2 size-4" />
                                Remove
                            </Button>
                        </div>
                    </div>
                ) : (
                    /* Empty Upload State */
                    <div className="flex flex-col items-center gap-3">
                        <div className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <Upload className="size-6" />
                        </div>

                        <div className="space-y-1">
                            <p className="text-sm font-semibold sm:text-base">
                                Upload your resume
                            </p>

                            <p className="text-xs text-muted-foreground sm:text-sm">
                                Drag and drop your PDF here, or select a file
                            </p>

                            <p className="text-xs text-muted-foreground">
                                PDF only · Maximum file size {maxSizeMB} MB
                            </p>
                        </div>

                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={openFileDialog}
                            className="mt-1 cursor-pointer"
                        >
                            <Upload className="mr-2 size-4" />
                            Select PDF
                        </Button>
                    </div>
                )}
            </div>

            {/* Validation Errors */}
            {errors.length > 0 && (
                <div
                    className="flex items-start gap-2 rounded-lg border border-destructive/20 bg-destructive/5 p-3 text-destructive"
                    role="alert"
                >
                    <AlertCircle className="mt-0.5 size-4 shrink-0" />

                    <p className="text-xs sm:text-sm">{errors[0]}</p>
                </div>
            )}
        </div>
    );
}
