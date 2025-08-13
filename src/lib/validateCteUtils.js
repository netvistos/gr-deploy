// Normaliza CNPJ removendo pontos, traços, barras e espaços.
export function normalizeCNPJ(cnpj) {
  return cnpj.replace(/[^\d]/g, "");
}

// Extrai a data do transporte do XML priorizando <dPrev>, caso não encontre usará: <dhEmi>.
export function extractTransportDate(xmlObj) {
  const dPrev = xmlObj?.ide?.dPrev?.[0];
  if (dPrev) return dPrev;

  const dhEmi = xmlObj?.ide?.dhEmi?.[0];
  if (dhEmi) return dhEmi.split("T")[0];

  return null;
}

// Compara se a data do transporte está dentro do período de vigência da apólice.
export function isDateWithinPolicy(transportDate, startDate, endDate) {
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

/**
 * Calcula o LMG (Limite Máximo de Garantia) considerando:
 * - LMG padrão da apólice (policy.lmg.default_brl)
 * - Overrides por bandas aplicadas em regras de risco
 */
export function calculateLMG(bands_applied = [], policy) {
  if (!policy) {
    return { lmg_brl: 0, lmg_sources: [] };
  }

  const defaultLMG = policy.lmg?.default_brl || 0;

  // Inclui todas as categorias dentro de risk_rules
  const allRiskRules = Object.values(policy.risk_rules || {}).flat();

  const sources = bands_applied.map((bandInfo) => {
    const rule = allRiskRules.find((r) => r.id === bandInfo.rule_id);
    if (!rule || !rule.bands?.length) {
      return {
        rule_id: bandInfo.rule_id,
        last_band_max: defaultLMG,
      };
    }

    const lastBand = rule.bands[rule.bands.length - 1];
    return {
      rule_id: bandInfo.rule_id,
      last_band_max: lastBand.range_brl.max,
    };
  });

  // O LMG final é o maior valor entre o default e todos os limites de regras aplicáveis
  const lmgFinal = Math.max(defaultLMG, ...sources.map((s) => s.last_band_max));

  return {
    lmg_brl: lmgFinal,
    lmg_sources: sources,
  };
}
