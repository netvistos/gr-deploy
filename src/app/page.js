"use client";

import { FileUpload } from "@/components/FileUpload";
import { useState } from "react";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [validationResult, setValidationResult] = useState(null);
  const [loadingStep, setLoadingStep] = useState("");

  // Função para validação
  const validateWithAI = async (cteData, source = "unknown") => {
    try {
      setLoadingStep("Validando com IA...");
      const validateResponse = await fetch("/api/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cteData }),
      });

      const validateData = await validateResponse.json();

      if (!validateResponse.ok) {
        throw new Error(validateData.error || "Erro na validação");
      }

      setValidationResult(validateData.validation);
      console.log(
        `Resultado da validação (${source}):`,
        validateData.validation
      );

      return validateData;
    } catch (err) {
      throw new Error(`Erro na validação: ${err.message}`);
    }
  };

  // Handler para Upload XML
  const handleFileSelect = async (file) => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    setValidationResult(null);

    try {
      // ETAPA 1: Upload e Parse do XML
      setLoadingStep("Processando arquivo XML...");
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

      setResult(uploadData);
      console.log("Dados extraídos:", uploadData.data);

      // ETAPA 2: Validação com IA
      await validateWithAI(uploadData.data, "XML");
    } catch (err) {
      setError(err.message);
      console.error("Erro:", err);
    } finally {
      setIsLoading(false);
      setLoadingStep("");
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

        {/* Upload XML */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="text-center space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800">
                📁 Upload de Arquivo XML
              </h3>
              <p className="text-blue-700 text-sm mt-1">
                Carregue um arquivo CTe em formato XML para validação automática
              </p>
            </div>

            <FileUpload
              onFileSelect={handleFileSelect}
              accept=".xml"
              disabled={isLoading}
            >
              {isLoading ? loadingStep : "Escolher arquivo XML"}
            </FileUpload>
          </div>
        </div>

        {/* Estados de Loading */}
        {isLoading && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-center text-blue-600 space-y-2">
              <div className="animate-pulse text-2xl">🤖 {loadingStep}</div>
              <div className="text-sm text-gray-500">
                {loadingStep.includes("IA")
                  ? "Analisando conformidade..."
                  : "Extraindo dados..."}
              </div>
            </div>
          </div>
        )}

        {/* Erro */}
        {error && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <span className="text-red-500 text-xl">❌</span>
                <h3 className="font-semibold text-red-800">Erro</h3>
              </div>
              <p className="text-red-700 text-sm mt-2">{error}</p>
            </div>
          </div>
        )}

        {/* Resultado da Validação */}
        {validationResult && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            {/* Determinar se está conforme baseado nos resultados */}
            {(() => {
              const isConforme = 
                validationResult.emitente?.cnpj === "aprovado" &&
                validationResult.emitente?.nome === "aprovado" &&
                validationResult.emitente?.vigencia === "aprovado" &&
                validationResult.mercadoria_excluida?.status === "aprovado" &&
                validationResult.regras_de_gerencia_de_riscos?.status === "aprovado";

              return (
                <div
                  className={`border rounded-lg p-6 ${
                    isConforme
                      ? "bg-green-50 border-green-200"
                      : "bg-red-50 border-red-200"
                  }`}
                >
                  <div className="flex items-center space-x-2 mb-4">
                    <span className="text-2xl">
                      {isConforme ? "✅" : "❌"}
                    </span>
                    <h3
                      className={`text-lg font-bold ${
                        isConforme
                          ? "text-green-800"
                          : "text-red-800"
                      }`}
                    >
                      {isConforme ? "CONFORME" : "NÃO CONFORME"}
                    </h3>
                    <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      XML
                    </span>
                  </div>

                  {/* Validação do Emitente */}
                  {validationResult.emitente && (
                    <div className="mb-4 p-3 bg-white/50 rounded border">
                      <h4 className="font-medium text-gray-800 mb-2">
                        🏢 Validação do Emitente
                      </h4>
                      <div className="text-sm text-gray-700 space-y-1">
                        <p>
                          <strong>CNPJ:</strong>{" "}
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            validationResult.emitente.cnpj === "aprovado" 
                              ? "bg-green-100 text-green-800" 
                              : "bg-red-100 text-red-800"
                          }`}>
                            {validationResult.emitente.cnpj}
                          </span>
                        </p>
                        <p>
                          <strong>Nome:</strong>{" "}
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            validationResult.emitente.nome === "aprovado" 
                              ? "bg-green-100 text-green-800" 
                              : "bg-red-100 text-red-800"
                          }`}>
                            {validationResult.emitente.nome}
                          </span>
                        </p>
                        <p>
                          <strong>Vigência:</strong>{" "}
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            validationResult.emitente.vigencia === "aprovado" 
                              ? "bg-green-100 text-green-800" 
                              : "bg-red-100 text-red-800"
                          }`}>
                            {validationResult.emitente.vigencia}
                          </span>
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Validação de Mercadoria Excluída */}
                  {validationResult.mercadoria_excluida && (
                    <div className="mb-4 p-3 bg-white/50 rounded border">
                      <h4 className="font-medium text-gray-800 mb-2">
                        📦 Validação de Mercadoria
                      </h4>
                      <div className="text-sm text-gray-700 space-y-1">
                        <p>
                          <strong>Status:</strong>{" "}
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            validationResult.mercadoria_excluida.status === "aprovado" 
                              ? "bg-green-100 text-green-800" 
                              : "bg-red-100 text-red-800"
                          }`}>
                            {validationResult.mercadoria_excluida.status}
                          </span>
                        </p>
                        {validationResult.mercadoria_excluida.motivo && 
                         validationResult.mercadoria_excluida.motivo !== "N/A" && (
                          <p>
                            <strong>Motivo:</strong> {validationResult.mercadoria_excluida.motivo}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Regras de Gerenciamento de Riscos */}
                  {validationResult.regras_de_gerencia_de_riscos && (
                    <div className="mb-4 p-3 bg-white/50 rounded border">
                      <h4 className="font-medium text-gray-800 mb-2">
                        ⚠️ Regras de Gerenciamento de Riscos
                      </h4>
                      <div className="text-sm text-gray-700 space-y-1">
                        <p>
                          <strong>Status:</strong>{" "}
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            validationResult.regras_de_gerencia_de_riscos.status === "aprovado" 
                              ? "bg-green-100 text-green-800" 
                              : "bg-red-100 text-red-800"
                          }`}>
                            {validationResult.regras_de_gerencia_de_riscos.status}
                          </span>
                        </p>
                        {validationResult.regras_de_gerencia_de_riscos.motivo && 
                         validationResult.regras_de_gerencia_de_riscos.motivo !== "N/A" && (
                          <p>
                            <strong>Motivo:</strong> {validationResult.regras_de_gerencia_de_riscos.motivo}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Limite de Cobertura */}
                  {validationResult.limite_de_cobertura && (
                    <div className="mb-4 p-3 bg-white/50 rounded border">
                      <h4 className="font-medium text-gray-800 mb-2">
                        💰 Limite de Cobertura
                      </h4>
                      <div className="text-sm text-gray-700">
                        <p>
                          <strong>Valor Aplicável:</strong> R$ {validationResult.limite_de_cobertura.valor}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Resumo dos Problemas */}
                  {!isConforme && (
                    <div className="mb-4">
                      <h4 className="font-medium text-red-800 mb-2">
                        🚨 Problemas Encontrados
                      </h4>
                      <ul className="text-sm text-red-700 space-y-1">
                        {validationResult.emitente?.cnpj === "reprovado" && (
                          <li className="flex items-start space-x-2">
                            <span className="text-red-500 mt-0.5">•</span>
                            <span>CNPJ do emitente não autorizado</span>
                          </li>
                        )}
                        {validationResult.emitente?.nome === "reprovado" && (
                          <li className="flex items-start space-x-2">
                            <span className="text-red-500 mt-0.5">•</span>
                            <span>Nome do emitente não autorizado</span>
                          </li>
                        )}
                        {validationResult.emitente?.vigencia === "reprovado" && (
                          <li className="flex items-start space-x-2">
                            <span className="text-red-500 mt-0.5">•</span>
                            <span>Vigência da apólice expirada</span>
                          </li>
                        )}
                        {validationResult.mercadoria_excluida?.status === "reprovado" && (
                          <li className="flex items-start space-x-2">
                            <span className="text-red-500 mt-0.5">•</span>
                            <span>Mercadoria está na lista de exclusões</span>
                          </li>
                        )}
                        {validationResult.regras_de_gerencia_de_riscos?.status === "reprovado" && (
                          <li className="flex items-start space-x-2">
                            <span className="text-red-500 mt-0.5">•</span>
                            <span>Não atende às regras de gerenciamento de riscos</span>
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
}
