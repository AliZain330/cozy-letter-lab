"use client";

import { useState, useRef, DragEvent, ChangeEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import {
  UploadCloud,
  File as FileIcon,
  Trash2,
  Loader,
  CheckCircle,
} from "lucide-react";

interface FileWithPreview {
  id: string;
  preview: string;
  progress: number;
  name: string;
  size: number;
  type: string;
  lastModified?: number;
  file?: File;
}

export default function FileUpload() {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (fileList: FileList) => {
    const newFiles = Array.from(fileList).map((file) => ({
      id: `${URL.createObjectURL(file)}-${Date.now()}`,
      preview: URL.createObjectURL(file),
      progress: 0,
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified,
      file,
    }));
    setFiles((prev) => [...prev, ...newFiles]);
    newFiles.forEach((f) => simulateUpload(f.id));
  };

  const simulateUpload = (id: string) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      setFiles((prev) =>
        prev.map((f) =>
          f.id === id ? { ...f, progress: Math.min(progress, 100) } : f
        )
      );
      if (progress >= 100) {
        clearInterval(interval);
        if (navigator.vibrate) navigator.vibrate(100);
      }
    }, 300);
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const onDragOver = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => setIsDragging(false);

  const onSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) handleFiles(e.target.files);
  };

  const formatFileSize = (bytes: number): string => {
    if (!bytes) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      {/* Drop zone */}
      <motion.div
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onClick={() => inputRef.current?.click()}
        initial={false}
        animate={{
          scale: isDragging ? 1.02 : 1,
        }}
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.2 }}
        className={cn(
          "relative rounded-2xl p-8 md:p-12 text-center cursor-pointer bg-secondary/50 border border-border shadow-sm hover:shadow-md backdrop-blur group transition-colors",
          isDragging && "ring-4 ring-primary/30 border-primary/50 animate-glow-slow"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          className="hidden"
          onChange={onSelect}
        />

        <div className="flex flex-col items-center gap-3">
          <div className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center group-hover:bg-accent transition-colors">
            <UploadCloud className="w-7 h-7 text-muted-foreground" />
          </div>

          <div className="space-y-1">
            <p className="text-base font-medium text-foreground">
              {isDragging
                ? "Drop files here"
                : files.length
                  ? "Add more files"
                  : "Upload your files"}
            </p>
            <p className="text-sm text-muted-foreground">
              {isDragging ? (
                <span className="text-primary">Release to upload</span>
              ) : (
                <>
                  Drag & drop files here, or{" "}
                  <span className="text-foreground underline underline-offset-2">browse</span>
                </>
              )}
            </p>
            <p className="text-xs text-muted-foreground/70 pt-1">
              Supports images, documents, videos, and more
            </p>
          </div>
        </div>
      </motion.div>

      {/* Uploaded files list */}
      <div className="space-y-3">
        <AnimatePresence>
          {files.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between"
            >
              <p className="text-sm font-medium text-foreground">
                Uploaded files ({files.length})
              </p>
              {files.length > 1 && (
                <button
                  onClick={() => setFiles([])}
                  className="text-sm font-medium px-3 py-1 bg-secondary hover:bg-accent rounded-md text-muted-foreground hover:text-destructive transition-colors duration-200"
                >
                  Clear all
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <div
          className={cn(
            "space-y-2 overflow-y-auto",
            files.length > 3 && "max-h-96"
          )}
        >
          <AnimatePresence>
            {files.map((file) => (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="glass-card rounded-xl p-3 flex items-center gap-3"
              >
                {/* Thumbnail */}
                <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-secondary flex-shrink-0 flex items-center justify-center">
                  {file.type.startsWith("image/") ? (
                    <img
                      src={file.preview}
                      alt={file.name}
                      className="w-full h-full object-cover"
                    />
                  ) : file.type.startsWith("video/") ? (
                    <video
                      src={file.preview}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FileIcon className="w-5 h-5 text-muted-foreground" />
                  )}
                  {file.progress === 100 && (
                    <div className="absolute inset-0 bg-success/20 flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-success" />
                    </div>
                  )}
                </div>

                {/* File info & progress */}
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <FileIcon className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                      <p className="text-sm font-medium text-foreground truncate">
                        {file.name}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {formatFileSize(file.size)}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          {Math.round(file.progress)}%
                        </span>
                        {file.progress < 100 ? (
                          <Loader className="w-3.5 h-3.5 text-muted-foreground animate-spin" />
                        ) : (
                          <Trash2
                            className="w-3.5 h-3.5 text-muted-foreground hover:text-destructive cursor-pointer transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              setFiles((prev) =>
                                prev.filter((f) => f.id !== file.id)
                              );
                            }}
                            aria-label="Remove file"
                          />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-primary rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${file.progress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
