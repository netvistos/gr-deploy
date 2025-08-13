// Normaliza CNPJ removendo pontos, traços, barras e espaços.
export function normalizeCNPJ(cnpj) {
  return cnpj.replace(/[^\d]/g, "");
}

// Extrai a data do transporte do XML priorizando <dPrev>, caso não encontre usará: <dhEmi>.
export function extractTransportDate(xmlObj) {
  // Tenta extrair <dPrev>
  const dPrev = xmlObj?.ide?.dPrev?.[0];
  if (dPrev) return dPrev;

  // Tenta extrair <dhEmi> e pegar só a data
  const dhEmi = xmlObj?.ide?.dhEmi?.[0];
  if (dhEmi) return dhEmi.split("T")[0];

  // Se não encontrar, retorna null
  return null;
}

// Compara se a data do transporte está dentro do período de vigência da apólice.
export function isDateWithinPolicy(transportDate, startDate, endDate) {
  // Converte datas da apólice para YYYY-MM-DD
  const [startDay, startMonth, startYear] = startDate.split("/");
  const [endDay, endMonth, endYear] = endDate.split("/");
  const start = new Date(`${startYear}-${startMonth}-${startDay}`);
  const end = new Date(`${endYear}-${endMonth}-${endDay}`);
  const transport = new Date(transportDate);

  return transport >= start && transport <= end;
}

// Função para formatar data no padrão brasileiro (DD/MM/YYYY)
export function formatDateBR(dateStr) {
  if (!dateStr) return "";
  const [year, month, day] = dateStr.split("-");
  if (!year || !month || !day) return dateStr;
  return `${day}/${month}/${year}`;
}

// Função para calcular o LMG
export function calculateLMG(bands_applied, policy) {
  const defaultLMG = policy.lmg.default_brl;
  if (!bands_applied || bands_applied.length === 0) return defaultLMG;

  const maxValues = bands_applied.map((bandInfo) => {
    const rule = [
      ...(policy.risk_rules?.by_goods || []),
      ...(policy.risk_rules?.by_shipper || []),
      ...(policy.risk_rules?.operations || []),
    ].find((r) => r.id === bandInfo.rule_id);

    if (!rule || !rule.bands?.length) return defaultLMG;

    // último band dessa regra
    const lastBand = rule.bands[rule.bands.length - 1];
    return lastBand.range_brl.max;
  });

  return Math.max(defaultLMG, ...maxValues);
}
