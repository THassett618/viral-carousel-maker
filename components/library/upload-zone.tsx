"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { cn } from "@/lib/utils";
import { Upload, Image } from "lucide-react";

interface Props {
  onFiles: (files: File[]) => void;
  uploading: boolean;
}

export function UploadZone({ onFiles, uploading }: Props) {
  const onDrop = useCallback(
    (accepted: File[]) => {
      if (accepted.length > 0) onFiles(accepted);
    },
    [onFiles]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/jpeg": [], "image/png": [], "image/webp": [] },
    maxSize: 10 * 1024 * 1024,
    multiple: true,
    disabled: uploading,
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed cursor-pointer transition-all p-8",
        isDragActive
          ? "border-primary bg-primary/5 scale-[1.01]"
          : "border-border bg-muted/20 hover:border-primary/50 hover:bg-muted/30",
        uploading && "opacity-50 cursor-not-allowed"
      )}
    >
      <input {...getInputProps()} />
      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
        {uploading ? (
          <span className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        ) : isDragActive ? (
          <Image className="w-5 h-5 text-primary" />
        ) : (
          <Upload className="w-5 h-5 text-primary" />
        )}
      </div>
      <div className="text-center">
        <p className="text-sm font-medium">
          {uploading
            ? "Uploading & classifying..."
            : isDragActive
            ? "Drop your slides here"
            : "Drop carousel slides here"}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">
          PNG, JPG, WebP · Max 10MB each · Multiple files OK
        </p>
      </div>
    </div>
  );
}
