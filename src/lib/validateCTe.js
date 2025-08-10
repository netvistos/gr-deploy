/**
 * Normaliza CNPJ removendo pontos, traços, barras e espaços.
 * @param {string} cnpj
 * @returns {string}
 */
function normalizeCNPJ(cnpj) {
  return cnpj.replace(/[^\d]/g, '');
}

/**
 * Extrai a data do transporte do XML priorizando <dPrev>, depois <dhEmi>.
 * @param {object} xmlObj - Objeto convertido do XML
 * @returns {string|null} - Data no formato YYYY-MM-DD ou null se não encontrar
 */
function extractTransportDate(xmlObj) {
  // Tenta extrair <dPrev>
  const dPrev = xmlObj?.ide?.dPrev?.[0];
  if (dPrev) return dPrev;

  // Tenta extrair <dhEmi> e pegar só a data
  const dhEmi = xmlObj?.ide?.dhEmi?.[0];
  if (dhEmi) return dhEmi.split('T')[0];

  // Se não encontrar, retorna null
  return null;
}