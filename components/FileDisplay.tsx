
import React, { useCallback, useState } from 'react';
import type { ProcessedFile } from '../types';
import { UploadCloudIcon, FileIcon, XIcon } from './icons';

interface FileDisplayProps {
  processedFiles: ProcessedFile[];
  onFilesAdded: (files: File[]) => void;
  onFileRemoved: (fileName: string) => void;
}

const Dropzone: React.FC<{ onFilesAdded: (files: File[]) => void }> = ({ onFilesAdded }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFilesAdded(Array.from(e.dataTransfer.files));
    }
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      className={`flex-1 flex items-center justify-center p-8 border-2 border-dashed rounded-xl transition-colors ${
        isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-slate-300 bg-white'
      }`}
    >
      <div className="text-center">
        <UploadCloudIcon className="mx-auto h-12 w-12 text-slate-400" />
        <p className="mt-2 text-lg font-semibold text-slate-700">Drag and drop files here</p>
        <p className="mt-1 text-sm text-slate-500">or click "Add Files" to get started</p>
        <ul className="mt-4 text-xs text-slate-500 list-disc list-inside text-left">
            <li>Supports multiple file selection</li>
            <li>Drag & drop anywhere in this area</li>
            <li>Customize names and download as ZIP</li>
        </ul>
      </div>
    </div>
  );
};

const FileItem: React.FC<{ file: ProcessedFile, onRemove: (fileName: string) => void }> = ({ file, onRemove }) => {
  return (
    <div className="bg-white p-3 rounded-lg shadow-sm flex items-start space-x-4 relative group">
      <FileIcon className="h-10 w-10 text-indigo-500 flex-shrink-0 mt-1" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-600 truncate" title={file.originalName}>
          <span className="text-xs text-slate-400">Original:</span> {file.originalName}
        </p>
        <p className="text-sm font-bold text-slate-800 truncate" title={file.newName}>
          <span className="text-xs text-slate-400 font-medium">Customized:</span> {file.newName}
        </p>
        <p className="text-xs text-slate-500 mt-1">{file.size}</p>
      </div>
      <div className="flex-shrink-0 ml-4 flex items-center">
        <span className="text-xs font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
            {file.extension}
        </span>
      </div>
      <button 
        onClick={() => onRemove(file.originalName)}
        className="absolute top-2 right-2 p-1 rounded-full bg-slate-200 text-slate-500 opacity-0 group-hover:opacity-100 hover:bg-red-100 hover:text-red-600 transition-all focus:opacity-100"
        aria-label="Remove file"
      >
        <XIcon className="w-3 h-3"/>
      </button>
    </div>
  );
};

export const FileDisplay: React.FC<FileDisplayProps> = ({ processedFiles, onFilesAdded, onFileRemoved }) => {
  if (processedFiles.length === 0) {
    return <Dropzone onFilesAdded={onFilesAdded} />;
  }

  return (
    <div className="flex-1 bg-slate-100 p-4 rounded-xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-4">
        {processedFiles.map(file => (
          <FileItem key={file.originalName} file={file} onRemove={onFileRemoved} />
        ))}
      </div>
    </div>
  );
};
