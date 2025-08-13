/**
 * Regras comuns aplicadas em todos os prompts.
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
 */
export function buildExclusionsPrompt(cteData, policy) {
  return `\
${COMMON_RULES}

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

/**
 * Prompt combinado: GERENCIAMENTO DE RISCO + LMG final.
 */
export function buildRiskAndLmgPrompt(cteData, policy) {
  const riskPayload = {
    by_goods: policy.risk_rules?.by_goods || [],
    by_shipper: policy.risk_rules?.by_shipper || [],
    operations: policy.risk_rules?.operations || [],
  };

  return `\
${COMMON_RULES}

TAREFA: Avalie GERENCIAMENTO DE RISCO e determine o LMG (Limite Máximo de Garantia) final.
- Sempre execute esta avaliação mesmo que o transporte tenha sido reprovado em outra etapa.
- Verifique critérios em risk_rules.by_goods, risk_rules.by_shipper e risk_rules.operations.
- Para cada regra aplicável:
  * Selecione o band cujo range_brl contenha goods.value_brl.
  * Inclua esse band em bands_applied.
  * Combine as obrigações (obligations) de todas as bands aplicáveis, sem criar novas obrigações que não estejam no policy.
- Cálculo do LMG:
  * Comece com policy.lmg.default_brl.
  * Para cada regra de risco aplicável, identifique o valor 'max' do último band dessa regra.
  * Compare todos esses valores 'max' com o default_brl e escolha apenas o MAIOR entre eles.
  * NÃO some valores de bands diferentes.
  * Se nenhuma regra for aplicável, use apenas o default_brl.
- NÃO invente obrigações fora das regras.
- NÃO use nenhuma lógica externa à listada acima para LMG (o valor vem exclusivamente das bands).

FORMATO DE SAÍDA (APENAS JSON):
{
  "stage": "GERENCIAMENTO_RISCO_LMG",
  "status": "aprovado" | "atenção",
  "matched_rule_ids": ["risk-..."],
  "obligations": ["..."],
  "bands_applied": [{"rule_id":"...", "band_index":0, "range_brl":{"min":0,"max":100000}}],
  "lmg_brl": 0
}

POLICY.risk_rules:
${JSON.stringify(riskPayload, null, 2)}

POLICY.lmg.default_brl:
${policy.lmg?.default_brl}

CTE:
${JSON.stringify(cteData, null, 2)}
`;
}
