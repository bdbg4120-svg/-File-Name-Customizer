
import React, { useState, useCallback, useMemo } from 'react';
import { Sidebar } from './components/Sidebar';
import { FileDisplay } from './components/FileDisplay';
import { DownloadIcon } from './components/icons';
import type { CustomizationOptions, ProcessedFile } from './types';

const defaultOptions: CustomizationOptions = {
  removeNumbers: false,
  removeParentheses: false,
  removeDashes: false,
  removeSpaces: false,
  replaceUnderscoreWithSpace: false,
  caseChange: '',
  addPrefix: '',
  addSuffix: '',
  removeWords: '',
  changeExtension: '',
  findText: '',
  replaceText: '',
  maxLength: 0,
};

const processFileName = (originalName: string, options: CustomizationOptions): string => {
  const lastDotIndex = originalName.lastIndexOf('.');
  let name = lastDotIndex === -1 ? originalName : originalName.substring(0, lastDotIndex);
  let ext = lastDotIndex === -1 ? '' : originalName.substring(lastDotIndex + 1);

  if (options.removeWords) {
    const wordsToRemove = options.removeWords.split(',').map(w => w.trim()).filter(Boolean);
    wordsToRemove.forEach(word => {
      name = name.replace(new RegExp(word, 'gi'), '');
    });
  }

  if (options.findText) {
    name = name.replace(new RegExp(options.findText, 'g'), options.replaceText);
  }

  if (options.replaceUnderscoreWithSpace) {
    name = name.replace(/_/g, ' ');
  }

  if (options.removeNumbers) name = name.replace(/[0-9]/g, '');
  if (options.removeParentheses) name = name.replace(/[()]/g, '');
  if (options.removeDashes) name = name.replace(/-/g, '');
  if (options.removeSpaces) name = name.replace(/\s/g, '');
  
  name = name.replace(/\s+/g, ' ').trim();

  switch (options.caseChange) {
    case 'lowercase':
      name = name.toLowerCase();
      break;
    case 'uppercase':
      name = name.toUpperCase();
      break;
    case 'sentence':
      name = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
      break;
    case 'title':
      name = name.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
      break;
  }
  
  if (options.addPrefix) name = `${options.addPrefix}${name}`;
  if (options.addSuffix) name = `${name}${options.addSuffix}`;

  if (options.maxLength > 0 && name.length > options.maxLength) {
    name = name.substring(0, options.maxLength);
  }

  if (options.changeExtension) {
    ext = options.changeExtension.replace('.', '');
  }

  return ext ? `${name}.${ext}` : name;
};

const formatBytes = (bytes: number, decimals = 2): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

function App() {
  const [files, setFiles] = useState<File[]>([]);
  const [options, setOptions] = useState<CustomizationOptions>(defaultOptions);
  const [isZipping, setIsZipping] = useState(false);
  
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFilesAdded = useCallback((newFiles: File[]) => {
    setFiles(prevFiles => {
      const existingNames = new Set(prevFiles.map(f => f.name));
      const uniqueNewFiles = newFiles.filter(f => !existingNames.has(f.name));
      return [...prevFiles, ...uniqueNewFiles];
    });
  }, []);
  
  const handleFileRemove = useCallback((fileNameToRemove: string) => {
    setFiles(prevFiles => prevFiles.filter(f => f.name !== fileNameToRemove));
  }, []);

  const processedFiles: ProcessedFile[] = useMemo(() => {
    return files.map(file => {
        const newName = processFileName(file.name, options);
        const newExt = newName.split('.').pop() || '';
        return {
            originalFile: file,
            originalName: file.name,
            newName: newName,
            size: formatBytes(file.size),
            extension: newExt
        }
    });
  }, [files, options]);

  const handleClearOptions = () => setOptions(defaultOptions);

  const handleDownloadZip = async () => {
    if (processedFiles.length === 0) return;
    
    setIsZipping(true);
    try {
        const JSZip = (window as any).JSZip;
        const saveAs = (window as any).saveAs;
        if (!JSZip || !saveAs) {
            alert("Could not find ZIP library. Please refresh the page.");
            return;
        }

        const zip = new JSZip();
        const nameCount: { [key: string]: number } = {};
        
        processedFiles.forEach(({ originalFile, newName }) => {
            let finalName = newName;
            if (nameCount[finalName] !== undefined) {
                nameCount[finalName]++;
                const lastDot = finalName.lastIndexOf('.');
                if (lastDot !== -1) {
                    finalName = `${finalName.substring(0, lastDot)} (${nameCount[finalName]})${finalName.substring(lastDot)}`;
                } else {
                    finalName = `${finalName} (${nameCount[finalName]})`;
                }
            } else {
                nameCount[finalName] = 0;
            }
            zip.file(finalName, originalFile);
        });

        const content = await zip.generateAsync({ type: 'blob' });
        saveAs(content, 'renamed-files.zip');
    } catch (error) {
        console.error("Error creating ZIP file:", error);
        alert("An error occurred while creating the ZIP file.");
    } finally {
        setIsZipping(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      <Sidebar options={options} setOptions={setOptions} onClear={handleClearOptions} fileCount={files.length} />
      
      <main className="flex-1 flex flex-col p-4 lg:p-6">
        <header className="flex-shrink-0 mb-4">
            <div className="flex flex-wrap justify-between items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">File Name Customizer</h1>
                    <p className="text-sm text-slate-500">Rename files in bulk with ease</p>
                </div>
                <div className="flex items-center gap-3">
                    <input 
                        type="file" 
                        multiple 
                        ref={fileInputRef} 
                        className="hidden" 
                        onChange={(e) => e.target.files && handleFilesAdded(Array.from(e.target.files))}
                    />
                    <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        + Add Files
                    </button>
                    {files.length > 0 && (
                        <button 
                            onClick={handleDownloadZip}
                            disabled={isZipping}
                            className="px-4 py-2 text-sm font-semibold text-white bg-green-600 rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-green-400 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            <DownloadIcon className="w-4 h-4" />
                            {isZipping ? 'Zipping...' : 'Download ZIP'}
                        </button>
                    )}
                </div>
            </div>
            {files.length > 0 && <p className="text-sm font-semibold text-slate-600 mt-4">Files ({files.length})</p>}
        </header>

        <FileDisplay processedFiles={processedFiles} onFilesAdded={handleFilesAdded} onFileRemoved={handleFileRemove}/>
      </main>
    </div>
  );
}

export default App;
