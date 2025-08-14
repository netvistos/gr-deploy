"use client";
import React from "react";

function ResultCard({ result, onNewUpload }) {
  if (!result) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="text-center text-gray-500">
          Nenhum resultado disponível
        </div>
      </div>
    );
  }

  const validation = result.validation || [];
  const overallStatus = (result.status || "não definido")
    .toString()
    .toLowerCase();

  const problems = validation.filter((v) => {
    const s = (v.status || v.etapaStatus || "").toString().toLowerCase();
    return s !== "aprovado" && s !== "aprovada";
  });
  const issuesCount = problems.length;

  const lmgStage = validation.find((v) => {
    const etapa = (v.etapa || v.stage || "").toString().toUpperCase();
    return etapa.includes("LMG");
  });
  const lmgExceeded =
    lmgStage && (lmgStage.status || "").toString().toLowerCase() !== "aprovado";

  const topViolations = validation
    .map((v) => {
      const title = v.stage || v.etapa || v.etapa_nome || "Etapa";
      const detail =
        (v.violations && v.violations[0]) ||
        v.motivo ||
        (v.obligations && v.obligations[0]) ||
        null;
      return { title, detail, status: v.status || "" };
    })
    .filter((x) => x.detail)
    .slice(0, 3);

  // --- Novo: extrair Gerenciamento de Risco (somente obrigações) ---
  const riskStage = validation.find((v) => {
    const s = (v.stage || v.etapa || "").toString().toUpperCase();
    return s.includes("GERENCIAMENTO_RISCO") || s.includes("RISCO");
  });
  const riskStatus = (riskStage?.status || "não definido")
    .toString()
    .toLowerCase();
  const riskObligations = riskStage?.obligations || [];

  const statusBadge = (s) => {
    const key = (s || "").toString().toLowerCase();
    if (key === "aprovado" || key === "aprovada")
      return "bg-green-100 text-green-800";
    if (key === "reprovado" || key === "erro") return "bg-red-100 text-red-800";
    return "bg-yellow-100 text-yellow-800";
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Resultado da Análise com IA
          </h3>
          <p className="text-sm text-gray-600">
            Status:&nbsp;
            <span
              className={`font-medium px-2 py-1 rounded ${statusBadge(
                overallStatus
              )}`}
            >
              {overallStatus}
            </span>
          </p>
        </div>

        <div className="text-right text-sm text-gray-600">
          <div>
            Etapas com problema:{" "}
            <span className="font-medium">{issuesCount}</span>
          </div>
          <div>
            LMG excedido:{" "}
            <span className="font-medium">{lmgExceeded ? "Sim" : "Não"}</span>
          </div>
        </div>
      </div>

      {topViolations.length > 0 && (
        <div className="border rounded p-3 bg-gray-50">
          <h4 className="font-medium text-gray-800 mb-2">
            Principais itens encontrados
          </h4>
          <ul className="text-sm space-y-1">
            {topViolations.map((v, i) => (
              <li key={i}>
                <span className="font-medium">{v.title}:</span>{" "}
                <span className="text-gray-700">{v.detail}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* --- Bloco atualizado: Gerenciamento de Risco (apenas obrigações) --- */}
      {riskStage && (
        <div className="border rounded p-3 bg-white">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-gray-800">
              Gerenciamento de Risco
            </h4>
            <span
              className={`text-sm font-medium px-2 py-1 rounded ${statusBadge(
                riskStatus
              )}`}
            >
              {riskStatus}
            </span>
          </div>

          {riskObligations && riskObligations.length > 0 ? (
            <div className="text-sm text-gray-700">
              <strong>Obrigações:</strong>
              <ul className="list-disc ml-5">
                {riskObligations.map((o, i) => (
                  <li key={i}>
                    {typeof o === "string" ? o : JSON.stringify(o)}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="text-sm text-gray-700">
              <strong>Obrigações:</strong> Nenhuma
            </div>
          )}
        </div>
      )}

      <div className="border border-gray-200 rounded-lg">
        <div className="px-4 py-3 bg-gray-50 rounded-t-lg">
          <h3 className="font-semibold text-gray-900">Debug / JSON completo</h3>
        </div>
        <div className="p-4 bg-white rounded-b-lg">
          <pre className="whitespace-pre-wrap text-sm bg-gray-50 p-4 rounded border overflow-x-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      </div>

      {typeof onNewUpload === "function" && (
        <div className="text-right">
          <button
            onClick={() => onNewUpload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Nova análise
          </button>
        </div>
      )}
    </div>
  );
}

export default ResultCard;
export { ResultCard };
