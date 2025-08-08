"use client";

export function LoadingSpinner({
  message = "Processando...",
  description = "Aguarde enquanto processamos sua solicitação",
  size = "default",
}) {
  // Configurações de tamanho
  const sizeConfig = {
    small: {
      spinner: "h-6 w-6",
      text: "text-sm",
      description: "text-xs",
    },
    default: {
      spinner: "h-12 w-12",
      text: "text-base",
      description: "text-sm",
    },
    large: {
      spinner: "h-16 w-16",
      text: "text-lg",
      description: "text-base",
    },
  };

  const config = sizeConfig[size] || sizeConfig.default;

  return (
    <div className="text-center space-y-4">
      {/* Spinner animado */}
      <div className="relative">
        <div
          className={`
            animate-spin rounded-full border-4 border-gray-200 border-t-blue-600 mx-auto
            ${config.spinner}
          `}
        />

        {/* Ponto central para melhor visual */}
        <div
          className={`
            absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
            w-2 h-2 bg-blue-600 rounded-full
            ${
              size === "small"
                ? "w-1 h-1"
                : size === "large"
                ? "w-3 h-3"
                : "w-2 h-2"
            }
          `}
        />
      </div>

      {/* Mensagem principal */}
      <div className="space-y-2">
        <p className={`font-medium text-blue-600 ${config.text}`}>{message}</p>

        {/* Descrição opcional */}
        {description && (
          <p className={`text-gray-500 ${config.description}`}>{description}</p>
        )}
      </div>

      {/* Indicador de progresso visual (pontos animados) */}
      <div className="flex justify-center space-x-1">
        <div
          className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"
          style={{ animationDelay: "0ms" }}
        />
        <div
          className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"
          style={{ animationDelay: "150ms" }}
        />
        <div
          className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"
          style={{ animationDelay: "300ms" }}
        />
      </div>
    </div>
  );
}
