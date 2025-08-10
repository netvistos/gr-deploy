/**
 * Normaliza CNPJ removendo pontos, traços, barras e espaços.
 */
function normalizeCNPJ(cnpj) {
  return cnpj.replace(/[^\d]/g, '');
}

/**
 * Extrai a data do transporte do XML priorizando <dPrev>, caso não encontre usará: <dhEmi>.
 * xmlObj - Objeto convertido do XML
 * Data no formato YYYY-MM-DD ou null se não encontrar
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


/**
 * Compara se a data do transporte está dentro do período de vigência da apólice.
 * transportDate - Data do transporte (YYYY-MM-DD)
 * startDate - Início da vigência (DD/MM/YYYY)
 * endDate - Fim da vigência (DD/MM/YYYY)
 * retorna boolean
 */
function isDateWithinPolicy(transportDate, startDate, endDate) {
  // Converte datas da apólice para YYYY-MM-DD
  const [startDay, startMonth, startYear] = startDate.split('/');
  const [endDay, endMonth, endYear] = endDate.split('/');
  const start = new Date(`${startYear}-${startMonth}-${startDay}`);
  const end = new Date(`${endYear}-${endMonth}-${endDay}`);
  const transport = new Date(transportDate);

  return transport >= start && transport <= end;
}

