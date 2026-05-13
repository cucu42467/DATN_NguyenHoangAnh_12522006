"use client";

import React, { useState, useRef } from "react";
import { Camera, X, Image as ImageIcon } from "lucide-react";

interface FileUploadProps {
  label: string;
  onFileChange: (file: File | null) => void;
  error?: string;
}

export default function FileUpload({ label, onFileChange, error }: FileUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileChange(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    onFileChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-3 w-full animate-in fade-in slide-in-from-top-2 duration-700">
      <label className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest ml-1">
        {label}
      </label>
      
      <div 
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-[2rem] p-8 text-center transition-all cursor-pointer group
          ${preview 
            ? 'border-indigo-500 bg-indigo-50/10 dark:bg-indigo-950/20' 
            : error 
              ? 'border-rose-500 bg-rose-50/5 dark:bg-rose-950/10' 
              : 'border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/30 hover:border-indigo-500 hover:bg-zinc-100 dark:hover:bg-zinc-800/50'
          }`}
      >
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden" 
        />

        {preview ? (
          <div className="relative inline-block group/preview">
            <img 
              src={preview} 
              alt="Preview" 
              className="h-32 w-48 object-cover rounded-2xl shadow-xl border-4 border-white dark:border-zinc-700" 
            />
            <button 
              onClick={removeFile}
              className="absolute -top-3 -right-3 p-1.5 bg-rose-500 text-white rounded-full shadow-lg opacity-0 group-hover/preview:opacity-100 transition-opacity hover:scale-110 active:scale-95"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="mt-3 text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest flex items-center justify-center gap-2">
               <ImageIcon className="h-3 w-3" /> Thay đổi ảnh
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div className="p-4 bg-white dark:bg-zinc-900 rounded-3xl shadow-sm text-zinc-300 group-hover:text-indigo-500 group-hover:scale-110 transition-all">
               <Camera className="h-8 w-8" />
            </div>
            <p className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mt-2">
               Kéo thả hoặc nhấn để tải ảnh hóa đơn
            </p>
          </div>
        )}
      </div>

      {error && (
        <p className="text-[10px] font-black text-rose-500 uppercase tracking-tighter ml-2 italic">
          {error}
        </p>
      )}
    </div>
  );
}
