"use client";

import { useState } from "react";
import { FileUpload } from "@/components/FileUpload";

export default function Home() {
  // Estados simplificados - apenas 3 estados principais
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // Handler simplificado para upload
  const handleFileSelect = async (file) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      // Upload e validação em uma única operação
      const formData = new FormData();
      formData.append("file", file);

      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const uploadData = await uploadResponse.json();

      if (!uploadResponse.ok) {
        throw new Error(uploadData.error || "Erro no upload");
      }

      // Validação automática
      const validateResponse = await fetch("/api/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cteData: uploadData.data }),
      });

      const validateData = await validateResponse.json();

      if (!validateResponse.ok) {
        throw new Error(validateData.error || "Erro na validação");
      }

      setResult(validateData);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Validador CTe
          </h1>
          <p className="text-gray-600">
            Validação de conformidade com apólice de seguro usando IA
          </p>
        </div>

        {/* Área de upload */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <FileUpload
            onFileSelect={handleFileSelect}
            accept=".xml"
            disabled={isLoading}
          >
            {isLoading ? "Processando..." : "Escolher arquivo XML"}
          </FileUpload>
        </div>

        {/* Estados de loading, erro e resultado serão adicionados aqui */}
      </div>
    </div>
  );
}
