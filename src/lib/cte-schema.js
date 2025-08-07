import { removeMask } from "./input-masks";

// CTE Schema - Fonte única da verdade para estrutura de dados
// Mudanças aqui refletem automaticamente no Parser XML e Formulário Manual

export const CTE_SCHEMA = {
  emitente: {
    cnpj: {
      type: "text",
      required: true,
      label: "CNPJ",
      placeholder: "00.000.000/0000-00",
      validation: "cnpj",
      mask: "cnpj",
      maxLength: 18,
    },
    nome: {
      type: "text",
      required: true,
      label: "Nome/Razão Social",
      placeholder: "Nome da empresa",
    },
    fantasia: {
      type: "text",
      required: false,
      label: "Nome Fantasia",
      placeholder: "Nome fantasia (opcional)",
    },
  },

  mercadoria: {
    descricao: {
      type: "textarea",
      required: true,
      label: "Descrição das Mercadorias",
      placeholder: "Descreva o produto/mercadoria transportado",
    },
    valor: {
      type: "text",
      required: true,
      label: "Valor da Carga (R$)",
      placeholder: "0,00",
      validation: "currency",
      mask: "currency",
    },
  },

  transporte: {
    origem: {
      municipio: {
        type: "text",
        required: true,
        label: "Município de Origem",
        placeholder: "Cidade de origem",
      },
      uf: {
        type: "select",
        required: true,
        label: "UF",
        options: [
          "AC",
          "AL",
          "AP",
          "AM",
          "BA",
          "CE",
          "DF",
          "ES",
          "GO",
          "MA",
          "MT",
          "MS",
          "MG",
          "PA",
          "PB",
          "PR",
          "PE",
          "PI",
          "RJ",
          "RN",
          "RS",
          "RO",
          "RR",
          "SC",
          "SP",
          "SE",
          "TO",
        ],
      },
    },
    destino: {
      municipio: {
        type: "text",
        required: true,
        label: "Município de Destino",
        placeholder: "Cidade de destino",
      },
      uf: {
        type: "select",
        required: true,
        label: "UF",
        options: [
          "AC",
          "AL",
          "AP",
          "AM",
          "BA",
          "CE",
          "DF",
          "ES",
          "GO",
          "MA",
          "MT",
          "MS",
          "MG",
          "PA",
          "PB",
          "PR",
          "PE",
          "PI",
          "RJ",
          "RN",
          "RS",
          "RO",
          "RR",
          "SC",
          "SP",
          "SE",
          "TO",
        ],
      },
    },
    informacoesTransporte: {
      type: "text",
      required: true,
      label: "Informações do Transporte",
      placeholder: "Ex: TRANSPORTE ESTADUAL",
    },
  },
};

// Títulos das seções para interface
export const SECTION_TITLES = {
  emitente: "🏢 Dados do Emitente",
  mercadoria: "📦 Dados da Mercadoria",
  transporte: "🗺️ Rota de Transporte",
};

// Chave para localStorage
const STORAGE_KEY = "cte_manual_form_data";

// Função para gerar estrutura vazia baseada no schema
export function createEmptyCTeData() {
  const data = {};

  Object.keys(CTE_SCHEMA).forEach((sectionKey) => {
    data[sectionKey] = {};

    Object.keys(CTE_SCHEMA[sectionKey]).forEach((fieldKey) => {
      const fieldConfig = CTE_SCHEMA[sectionKey][fieldKey];

      // Se é campo aninhado (como origem/destino)
      if (!fieldConfig.type) {
        data[sectionKey][fieldKey] = {};
        Object.keys(fieldConfig).forEach((subFieldKey) => {
          data[sectionKey][fieldKey][subFieldKey] = "";
        });
      } else {
        // Campo simples - valor inicial baseado no tipo
        switch (fieldConfig.type) {
          case "number":
            data[sectionKey][fieldKey] = "";
            break;
          case "date":
            data[sectionKey][fieldKey] = "";
            break;
          default:
            data[sectionKey][fieldKey] = "";
        }
      }
    });
  });

  return data;
}

// 💾 FUNÇÕES DE ARMAZENAMENTO LOCAL

// Salvar dados no localStorage
export function saveCTeDataToStorage(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    console.log("Dados CTe salvos no localStorage");
  } catch (error) {
    console.warn("Erro ao salvar dados CTe:", error);
  }
}

// Carregar dados do localStorage
export function loadCTeDataFromStorage() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsedData = JSON.parse(saved);
      console.log("Dados CTe carregados do localStorage");
      return parsedData;
    }
  } catch (error) {
    console.warn("Erro ao carregar dados CTe:", error);
  }

  // Retorna estrutura vazia se não conseguir carregar
  return createEmptyCTeData();
}

// Limpar dados salvos
export function clearCTeDataFromStorage() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    console.log("Dados CTe removidos do localStorage");
  } catch (error) {
    console.warn("Erro ao limpar dados CTe:", error);
  }
}

// Auto-save com debounce (salva automaticamente após 1 segundo sem mudanças)
let saveTimeout;
export function autoSaveCTeData(data) {
  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    saveCTeDataToStorage(data);
  }, 1000);
}

// Função para obter configuração de um campo específico
export function getFieldConfig(sectionKey, fieldKey, subFieldKey = null) {
  if (subFieldKey) {
    return CTE_SCHEMA[sectionKey]?.[fieldKey]?.[subFieldKey];
  }
  return CTE_SCHEMA[sectionKey]?.[fieldKey];
}

// Função para validar um campo baseado no schema
export function validateField(sectionKey, fieldKey, value, subFieldKey = null) {
  const config = getFieldConfig(sectionKey, fieldKey, subFieldKey);
  if (!config) return { valid: true };

  // Campo obrigatório
  if (config.required && (!value || value.toString().trim() === "")) {
    return { valid: false, message: "Campo obrigatório" };
  }

  // Validações específicas
  switch (config.validation) {
    case "cnpj":
      return validateCNPJ(value);
    case "currency":
      return validateCurrency(value);
    case "positive":
      return validatePositiveNumber(value);
    case "integer":
      return validateInteger(value);
    default:
      return { valid: true };
  }
}

// Validações específicas
function validateCNPJ(cnpj) {
  if (!cnpj) return { valid: true }; // Campo pode estar vazio se não obrigatório

  const cleanCNPJ = cnpj.replace(/[^\d]/g, "");
  if (cleanCNPJ.length !== 14) {
    return { valid: false, message: "CNPJ deve ter 14 dígitos" };
  }

  return { valid: true };
}

function validateCurrency(value) {
  if (!value) return { valid: true };

  const numValue = parseFloat(value);
  if (isNaN(numValue) || numValue < 0) {
    return { valid: false, message: "Valor deve ser um número positivo" };
  }

  return { valid: true };
}

function validatePositiveNumber(value) {
  if (!value) return { valid: true };

  const numValue = parseFloat(value);
  if (isNaN(numValue) || numValue < 0) {
    return { valid: false, message: "Deve ser um número positivo" };
  }

  return { valid: true };
}

function validateInteger(value) {
  if (!value) return { valid: true };

  const numValue = parseInt(value);
  if (isNaN(numValue) || numValue < 0 || !Number.isInteger(numValue)) {
    return { valid: false, message: "Deve ser um número inteiro positivo" };
  }

  return { valid: true };
}

// Função para formatar valor para exibição
export function formatFieldValue(value, fieldConfig) {
  if (!value) return "";

  switch (fieldConfig.validation) {
    case "currency":
      return parseFloat(value).toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    case "cnpj":
      return value.replace(
        /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
        "$1.$2.$3/$4-$5"
      );
    default:
      return value.toString();
  }
}

// ✨ NOVA FUNÇÃO: Validação que considera máscaras
export function validateFieldWithMask(
  sectionKey,
  fieldKey,
  value,
  subFieldKey = null
) {
  const config = getFieldConfig(sectionKey, fieldKey, subFieldKey);
  if (!config) return { valid: true };

  // Se tem máscara, remove ela antes de validar
  let cleanValue = value;
  if (config.mask) {
    cleanValue = removeMask(value, config.mask);
  }

  // Campo obrigatório
  if (config.required && (!cleanValue || cleanValue.toString().trim() === "")) {
    return { valid: false, message: "Campo obrigatório" };
  }

  // Validações específicas
  switch (config.validation) {
    case "cnpj":
      return validateCNPJ(cleanValue);
    case "currency":
      return validateCurrency(cleanValue);
    case "positive":
      return validatePositiveNumber(cleanValue);
    case "integer":
      return validateInteger(cleanValue);
    default:
      return { valid: true };
  }
}
