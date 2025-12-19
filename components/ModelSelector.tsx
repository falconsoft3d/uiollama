"use client";

import { useState, useEffect } from "react";

interface ModelSelectorProps {
  selectedModel: string;
  onModelChange: (model: string) => void;
}

interface OllamaModel {
  name: string;
  modified_at: string;
  size: number;
}

export default function ModelSelector({ selectedModel, onModelChange }: ModelSelectorProps) {
  const [models, setModels] = useState<OllamaModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [newModelName, setNewModelName] = useState("");
  const [isInstalling, setIsInstalling] = useState(false);
  const [installError, setInstallError] = useState("");

  useEffect(() => {
    fetchModels();
  }, []);

  const fetchModels = async () => {
    try {
      const response = await fetch("/api/models");
      const data = await response.json();
      setModels(data.models || []);
    } catch (error) {
      console.error("Error al cargar modelos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatSize = (bytes: number) => {
    const gb = bytes / (1024 ** 3);
    return `${gb.toFixed(1)} GB`;
  };

  const handleInstallModel = async () => {
    if (!newModelName.trim()) return;

    setIsInstalling(true);
    setInstallError("");

    try {
      const response = await fetch("/api/models/pull", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: newModelName.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al instalar el modelo");
      }

      // Recargar la lista de modelos
      await fetchModels();
      setShowInstallModal(false);
      setNewModelName("");
      
      // Seleccionar el nuevo modelo
      onModelChange(newModelName.trim());
    } catch (error: any) {
      setInstallError(error.message);
    } finally {
      setIsInstalling(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors border border-gray-300 dark:border-gray-600"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
        </svg>
        <span className="font-medium">{selectedModel}</span>
        <svg className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              Cargando modelos...
            </div>
          ) : models.length === 0 ? (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              <p>No hay modelos disponibles</p>
              <p className="text-xs mt-2">Haz click en "Instalar modelo" abajo</p>
            </div>
          ) : (
            <div className="py-2">
              {models.map((model) => (
                <button
                  key={model.name}
                  onClick={() => {
                    onModelChange(model.name);
                    setIsOpen(false);
                  }}
                  className={`w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                    selectedModel === model.name ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {model.name}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {formatSize(model.size)}
                      </div>
                    </div>
                    {selectedModel === model.name && (
                      <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
          
          {/* Botón para instalar nuevo modelo */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-2">
            <button
              onClick={() => {
                setShowInstallModal(true);
                setIsOpen(false);
              }}
              className="w-full px-3 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Instalar modelo
            </button>
          </div>
        </div>
      )}

      {/* Modal de instalación */}
      {showInstallModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Instalar nuevo modelo
              </h3>
              <button
                onClick={() => {
                  setShowInstallModal(false);
                  setNewModelName("");
                  setInstallError("");
                }}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nombre del modelo
              </label>
              <input
                type="text"
                value={newModelName}
                onChange={(e) => setNewModelName(e.target.value)}
                placeholder="Ej: llama3.3, mistral, qwen2.5"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isInstalling}
              />
              <div className="mt-3 max-h-40 overflow-y-auto">
                <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">
                  Modelos populares:
                </p>
                <div className="space-y-1 text-xs text-gray-500 dark:text-gray-400">
                  <div className="grid grid-cols-2 gap-1">
                    <button onClick={() => setNewModelName("llama3.3")} className="text-left hover:text-blue-600 dark:hover:text-blue-400">• llama3.3 (70B)</button>
                    <button onClick={() => setNewModelName("llama3.1")} className="text-left hover:text-blue-600 dark:hover:text-blue-400">• llama3.1 (8B/70B)</button>
                    <button onClick={() => setNewModelName("mistral")} className="text-left hover:text-blue-600 dark:hover:text-blue-400">• mistral (7B)</button>
                    <button onClick={() => setNewModelName("qwen2.5")} className="text-left hover:text-blue-600 dark:hover:text-blue-400">• qwen2.5 (0.5-72B)</button>
                    <button onClick={() => setNewModelName("qwen2.5-coder")} className="text-left hover:text-blue-600 dark:hover:text-blue-400">• qwen2.5-coder (0.5-32B)</button>
                    <button onClick={() => setNewModelName("codellama")} className="text-left hover:text-blue-600 dark:hover:text-blue-400">• codellama (7-70B)</button>
                    <button onClick={() => setNewModelName("gemma2")} className="text-left hover:text-blue-600 dark:hover:text-blue-400">• gemma2 (2B/9B/27B)</button>
                    <button onClick={() => setNewModelName("phi4")} className="text-left hover:text-blue-600 dark:hover:text-blue-400">• phi4 (14B)</button>
                    <button onClick={() => setNewModelName("deepseek-r1")} className="text-left hover:text-blue-600 dark:hover:text-blue-400">• deepseek-r1 (1.5-671B)</button>
                    <button onClick={() => setNewModelName("mixtral")} className="text-left hover:text-blue-600 dark:hover:text-blue-400">• mixtral (8x7B/8x22B)</button>
                  </div>
                </div>
              </div>
            </div>

            {installError && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-600 dark:text-red-400">
                {installError}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowInstallModal(false);
                  setNewModelName("");
                  setInstallError("");
                }}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                disabled={isInstalling}
              >
                Cancelar
              </button>
              <button
                onClick={handleInstallModel}
                disabled={!newModelName.trim() || isInstalling}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {isInstalling ? (
                  <>
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Instalando...
                  </>
                ) : (
                  "Instalar"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
