// src/lib/prompts/semanticValidationPrompt.v2.js

/**
 * Regras gerais usadas em todos os prompts (evita repetir texto).
 */
const COMMON_RULES = `\
Você é um validador de CTe (Conhecimento de Transporte Eletrônico) que aplica uma apólice.
- NÃO reavalie CNPJ e datas (já validados fora desta etapa).
- Compare SEMANTICAMENTE os campos textuais (mercadoria, embarcador, origem/destino).
- Considere equivalências, sinônimos, hipônimos e termos genéricos ↔ específicos.
- A descrição completa da mercadoria vem no campo goods.name.
- Use IDs de regras da apólice para justificar enquadramentos (matched_rule_ids).
- Responda APENAS com JSON válido no formato solicitado.
`;

/**
 * Prompt para o bloco "Exclusões".
 * Saída esperada:
 * {
 *   "stage": "BENS_EXCLUIDOS",
 *   "status": "aprovado" | "reprovado",
 *   "matched_rule_ids": ["excl-..."],
 *   "violations": ["texto curto apontando o porquê do enquadramento"]
 * }
 */
export function buildExclusionsPrompt(cteData, policyV2) {
  return `\
${COMMON_RULES}

TAREFA: Avalie APENAS EXCLUSÕES com base em policy.exclusions.

FORMATO DE SAÍDA (APENAS JSON):
{
  "stage": "BENS_EXCLUIDOS",
  "status": "aprovado | reprovado",
  "matched_rule_ids": ["excl-..."],
  "violations": ["..."]
}

POLICY.exclusions:
${JSON.stringify(policyV2.exclusions, null, 2)}

CTE:
${JSON.stringify(cteData, null, 2)}
`;
}

/**
 * Prompt para o bloco "Gerenciamento de Risco".
 * (usa policy.risk_rules.by_goods, policy.risk_rules.by_shipper e policy.risk_rules.operations)
 * Saída esperada:
 * {
 *   "stage": "GERENCIAMENTO_RISCO",
 *   "status": "aprovado" | "atenção",
 *   "matched_rule_ids": ["risk-...", "op-...", "risk-A", ...],
 *   "obligations": ["..."],            // obrigações combinadas das bands aplicadas
 *   "bands_applied": [                 // opcional, útil para auditoria
 *     {"rule_id":"risk-A","band_index":1,"range_brl":{"min":40000,"max":350000,"inclusive_min":true,"inclusive_max":true}}
 *   ]
 * }
 */
export function buildRiskPrompt(cteData, policyV2) {
  // montamos um objeto compacto só com as seções de risco
  const risk = policyV2.risk_rules || {};
  const riskPayload = {
    by_goods: risk.by_goods || [],
    by_shipper: risk.by_shipper || [],
    operations: risk.operations || [],
  };

  return `\
${COMMON_RULES}

TAREFA: Avalie APENAS GERENCIAMENTO DE RISCO.
- Verifique critérios em risk_rules.by_goods, risk_rules.by_shipper e risk_rules.operations.
- Quando vários enquadramentos ocorrerem, combine obrigações de todas as bands aplicáveis.
- Para bands, selecione apenas a(s) faixa(s) cujo range_brl contenha o goods.value_brl do CTe.
- Não invente obrigações fora das regras.

FORMATO DE SAÍDA (APENAS JSON):
{
  "stage": "GERENCIAMENTO_RISCO",
  "status": "aprovado | atenção",
  "matched_rule_ids": ["risk-..."],
  "obligations": ["..."],
  "bands_applied": [{"rule_id":"...", "band_index":0, "range_brl":{"min":0,"max":100000}}]
}

POLICY.risk_rules:
${JSON.stringify(riskPayload, null, 2)}

CTE:
${JSON.stringify(cteData, null, 2)}
`;
}

/**
 * Prompt para o bloco "LMG".
 * (usa policy.lmg.default_brl e policy.lmg.overrides)
 * Saída esperada:
 * {
 *   "stage": "LMG",
 *   "lmg_brl": 3000000,
 *   "basis": "override" | "default",
 *   "override_id": "lmg-..." | null,
 *   "matched_rule_ids": ["lmg-..."] // se 'override'
 * }
 */
export function buildLmgPrompt(cteData, policyV2) {
  const lmg = policyV2.lmg || {};
  const lmgPayload = {
    default_brl: lmg.default_brl,
    overrides: lmg.overrides || [],
  };

  return `\
${COMMON_RULES}

TAREFA: Determine APENAS o LMG (Limite Máximo de Garantia).
- Se alguma regra de override em lmg.overrides enquadrar, use o value_brl do override (e informe override_id e matched_rule_ids).
- Caso contrário, use lmg.default_brl (basis="default", override_id=null, matched_rule_ids=[]).
- NÃO altere valores; apenas escolha o LMG correto segundo os critérios.

FORMATO DE SAÍDA (APENAS JSON):
{
  "stage": "LMG",
  "lmg_brl": 0,
  "basis": "override | default",
  "override_id": "lmg-..." | null,
  "matched_rule_ids": ["lmg-..."]
}

POLICY.lmg:
${JSON.stringify(lmgPayload, null, 2)}

CTE:
${JSON.stringify(cteData, null, 2)}
`;
}
