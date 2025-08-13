/**
 * Prompt para o bloco "Exclusões".
 */
export function buildExclusionsPrompt(cteData, policy) {
  return `\
TAREFA: Avalie APENAS EXCLUSÕES com base em policy.exclusions.

FORMATO DE SAÍDA (APENAS JSON):
{
  "stage": "BENS_EXCLUIDOS",
  "status": "aprovado" | "reprovado",
  "matched_rule_ids": ["excl-..."],
  "violations": ["..."]
}

POLICY.exclusions:
${JSON.stringify(policy.exclusions, null, 2)}

CTE:
${JSON.stringify(cteData, null, 2)}
`;
}

export function buildRiskPrompt(cteData, policy) {
  const riskPayload = {
    by_goods: policy.risk_rules?.by_goods || [],
    by_shipper: policy.risk_rules?.by_shipper || [],
    operations: policy.risk_rules?.operations || [],
  };

  return `\
TAREFA: Avaliar GERENCIAMENTO DE RISCO.
- Sempre verificar critérios em risk_rules.by_goods, risk_rules.by_shipper e risk_rules.operations.
- Para cada REGRA APLICÁVEL:
  * O valor de goods.value_brl deve estar dentro do range_brl do band escolhido (inclusive_min e inclusive_max quando definidos).
  * Inclua esse band em "bands_applied" com: rule_id e band_index (índice do band na lista da regra).
  * NÃO invente bands ou obrigações fora do policy.
  * Combine obrigações de todas as bands aplicáveis (mantendo exatamente o texto do policy).
- STATUS:
  * "atenção" se existir pelo menos uma regra aplicável (matched_rule_ids não vazio).
  * "aprovado" caso contrário.

FORMATO DE SAÍDA (APENAS JSON):
{
  "stage": "GERENCIAMENTO_RISCO",
  "status": "aprovado" | "atenção",
  "matched_rule_ids": ["..."],
  "obligations": ["..."],
  "bands_applied": [{"rule_id":"...", "band_index":0}]
}

POLICY.risk_rules:
${JSON.stringify(riskPayload, null, 2)}

CTE:
${JSON.stringify(cteData, null, 2)}
`;
}
