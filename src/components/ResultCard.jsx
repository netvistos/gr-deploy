"use client";

export function ResultCard({ result, onNewUpload }) {
  const { validation } = result;

  if (!result) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="text-center text-gray-500">
          Nenhum resultado disponível
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
      {/* Resultado Completo da IA */}
      <div className="border border-gray-200 rounded-lg">
        <div className="px-4 py-3 bg-gray-50 rounded-t-lg">
          <h3 className="font-semibold text-gray-900">
            Análise Completa da IA
          </h3>
        </div>
        <div className="p-4 bg-white rounded-b-lg">
          <pre className="whitespace-pre-wrap text-sm bg-gray-50 p-4 rounded border overflow-x-auto">
            {JSON.stringify(validation, null, 2)}
          </pre>
        </div>
      </div>

      {/* Botão Novo Upload */}
      <div className="pt-4 border-t border-gray-200">
        <button
          onClick={onNewUpload}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
        >
          Novo Upload
        </button>
      </div>
    </div>
  );
}
