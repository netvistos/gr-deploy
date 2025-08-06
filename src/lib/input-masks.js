// Funções de máscara para inputs
// Aplicam formatação automática conforme o usuário digita

// Máscara para CNPJ: 00.000.000/0000-00
export function applyCNPJMask(value) {
  if (!value) return '';

  // Remove tudo que não é número
  const cleanValue = value.replace(/\D/g, '');

  // Aplica a máscara progressivamente
  if (cleanValue.length <= 2) {
    return cleanValue;
  } else if (cleanValue.length <= 5) {
    return cleanValue.replace(/(\d{2})(\d{0,3})/, '$1.$2');
  } else if (cleanValue.length <= 8) {
    return cleanValue.replace(/(\d{2})(\d{3})(\d{0,3})/, '$1.$2.$3');
  } else if (cleanValue.length <= 12) {
    return cleanValue.replace(/(\d{2})(\d{3})(\d{3})(\d{0,4})/, '$1.$2.$3/$4');
  } else {
    return cleanValue.replace(
      /(\d{2})(\d{3})(\d{3})(\d{4})(\d{0,2})/,
      '$1.$2.$3/$4-$5'
    );
  }
}

// ✨ NOVA MÁSCARA MONETÁRIA ESTILO TRANSFERÊNCIA BANCÁRIA
export function applyCurrencyMask(value) {
  if (!value) return '';

  // Remove tudo que não é número
  let cleanValue = value.replace(/\D/g, '');

  // Se vazio, retorna vazio
  if (!cleanValue) return '';

  // Converte para número (centavos)
  const numberValue = parseInt(cleanValue);

  // Formata como moeda brasileira
  const formatted = (numberValue / 100).toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return formatted;
}

// Máscara para data: DD/MM/AAAA
export function applyDateMask(value) {
  if (!value) return '';

  // Remove tudo que não é número
  const cleanValue = value.replace(/\D/g, '');

  // Aplica a máscara progressivamente
  if (cleanValue.length <= 2) {
    return cleanValue;
  } else if (cleanValue.length <= 4) {
    return cleanValue.replace(/(\d{2})(\d{0,2})/, '$1/$2');
  } else {
    return cleanValue.replace(/(\d{2})(\d{2})(\d{0,4})/, '$1/$2/$3');
  }
}

// Máscara para números positivos (peso, volumes)
export function applyNumberMask(value, decimals = 2) {
  if (!value) return '';

  // Remove tudo que não é número ou vírgula/ponto
  let cleanValue = value.replace(/[^\d,.-]/g, '');

  // Substitui vírgula por ponto para processamento
  cleanValue = cleanValue.replace(',', '.');

  // Remove pontos extras (manter apenas o último)
  const parts = cleanValue.split('.');
  if (parts.length > 2) {
    cleanValue = parts[0] + '.' + parts.slice(1).join('');
  }

  // Limita casas decimais
  if (cleanValue.includes('.')) {
    const [intPart, decPart] = cleanValue.split('.');
    const limitedDec = decPart.substring(0, decimals);
    cleanValue = intPart + (limitedDec ? '.' + limitedDec : '');
  }

  // Substitui ponto por vírgula para exibição brasileira
  return cleanValue.replace('.', ',');
}

// ✨ FUNÇÃO PARA REMOVER MÁSCARA ATUALIZADA
export function removeMask(value, type) {
  if (!value) return '';

  switch (type) {
    case 'cnpj':
      return value.replace(/\D/g, '');

    case 'currency':
      // Remove formatação e mantém como string decimal
      const cleanCurrency = value.replace(/\D/g, '');
      if (!cleanCurrency) return '0';

      // Converte centavos para reais (string)
      const numberValue = parseInt(cleanCurrency) / 100;
      return numberValue.toString();

    case 'date':
      return value.replace(/\D/g, '');

    case 'number':
      return value.replace(',', '.');

    default:
      return value;
  }
}

// Função principal para aplicar máscara baseada no tipo
export function applyMask(value, maskType) {
  switch (maskType) {
    case 'cnpj':
      return applyCNPJMask(value);

    case 'currency':
      return applyCurrencyMask(value);

    case 'date':
      return applyDateMask(value);

    case 'number':
      return applyNumberMask(value);

    default:
      return value;
  }
}

// Validar se valor com máscara está completo
export function isMaskComplete(value, maskType) {
  switch (maskType) {
    case 'cnpj':
      return value.replace(/\D/g, '').length === 14;

    case 'date':
      return value.replace(/\D/g, '').length === 8;

    default:
      return true;
  }
}

// ✨ NOVA FUNÇÃO: Converte valor armazenado de volta para exibição com máscara
export function formatStoredValue(value, maskType) {
  if (!value) return '';

  switch (maskType) {
    case 'currency':
      // Converte valor decimal para centavos e aplica máscara
      const numValue = parseFloat(value);
      if (isNaN(numValue)) return '';

      const centavos = Math.round(numValue * 100).toString();
      return applyCurrencyMask(centavos);

    default:
      return applyMask(value.toString(), maskType);
  }
}
