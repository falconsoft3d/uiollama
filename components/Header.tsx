"use client";

import ModelSelector from "./ModelSelector";

interface HeaderProps {
  onClearChat: () => void;
  selectedModel: string;
  onModelChange: (model: string) => void;
}

export default function Header({ onClearChat, selectedModel, onModelChange }: HeaderProps) {
  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <img 
          src="/logo.png" 
          alt="Logo" 
          className="w-16 h-16 object-contain"
        />
        <div>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
            UIOLLAMA
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Ollama Interface
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <ModelSelector 
          selectedModel={selectedModel}
          onModelChange={onModelChange}
        />
        <a
          href="/api-docs"
          target="_blank"
          className="px-3 py-1.5 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors flex items-center gap-1"
        >
          📚 API Docs
        </a>
        <button
          onClick={onClearChat}
          className="px-3 py-1.5 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          Limpiar chat
        </button>
      </div>
    </header>
  );
}
