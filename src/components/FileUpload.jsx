"use client";

import { useState, useRef, useCallback } from "react";

export function FileUpload({
  onFileSelect,
  accept = ".xml",
  disabled = false,
  children,
}) {
  // Estados para controlar a interação
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  // Função para validar o arquivo
  const validateFile = (file) => {
    // Limpa erro anterior
    setError(null);

    // Verifica se é um arquivo XML
    if (!file.name.toLowerCase().endsWith(".xml")) {
      setError("Por favor, selecione apenas arquivos XML");
      return false;
    }

    // Verifica tamanho (máximo 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      setError("Arquivo muito grande. Máximo 10MB permitido.");
      return false;
    }

    return true;
  };

  // Handler para quando um arquivo é selecionado
  const handleFileSelect = useCallback(
    (file) => {
      if (validateFile(file)) {
        onFileSelect(file);
      }
    },
    [onFileSelect]
  );

  // Handlers para drag and drop
  const handleDragOver = useCallback(
    (e) => {
      e.preventDefault();
      if (!disabled) {
        setIsDragOver(true);
      }
    },
    [disabled]
  );

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragOver(false);

      if (disabled) return;

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        handleFileSelect(files[0]);
      }
    },
    [disabled, handleFileSelect]
  );

  // Handler para clique no botão
  const handleButtonClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  // Handler para mudança no input file
  const handleInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  return (
    <div className="w-full">
      {/* Input file oculto */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleInputChange}
        className="hidden"
        disabled={disabled}
      />

      {/* Área de drag and drop */}
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200
          ${
            isDragOver
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 hover:border-gray-400"
          }
          ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleButtonClick}
      >
        {/* Ícone */}
        <div className="mb-4">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
            aria-hidden="true"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Texto principal */}
        <div className="space-y-2">
          <p className="text-lg font-medium text-gray-900">
            {children || "Arraste um arquivo XML aqui"}
          </p>
          <p className="text-sm text-gray-500">
            ou clique para selecionar um arquivo
          </p>
        </div>

        {/* Mensagem de erro */}
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}
