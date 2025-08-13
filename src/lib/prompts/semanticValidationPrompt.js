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
 * - Genérico (não referencia nomes específicos de regras).
 * - Garante status = "atenção" quando houver qualquer matched_rule_ids.
 * - LMG = máximo entre default e o teto (último band.max) das regras aplicáveis.
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
- Execute esta avaliação mesmo que o transporte tenha sido reprovado em outra etapa.
- Verifique critérios em risk_rules.by_goods, risk_rules.by_shipper e risk_rules.operations.
- Para cada REGRA APLICÁVEL:
  * Selecione o band cujo range_brl contenha goods.value_brl.
  * Inclua esse band em "bands_applied" com: rule_id, band_index e a cópia de range_brl.
  * Combine as obrigações de todas as bands aplicáveis, sem criar novas obrigações além do policy.
- Definição de STATUS:
  * Se existir ao menos uma REGRA APLICÁVEL (matched_rule_ids não vazio) ⇒ "status": "atenção".
  * Caso contrário ⇒ "status": "aprovado".
- Cálculo do LMG (somente a partir do policy):
  * Monte a lista CANDIDATOS_LMG = [policy.lmg.default_brl] + [último band.range_brl.max de cada REGRA APLICÁVEL].
  * lmg_brl = max(CANDIDATOS_LMG).
  * Nunca some valores de bands diferentes.
  * Nunca use valores que não estejam explícitos em policy.risk_rules.*.bands[*].range_brl.max.
  * Se lmg_brl > policy.lmg.default_brl, deve existir pelo menos uma REGRA APLICÁVEL cujo último band.range_brl.max == lmg_brl; se não houver, use policy.lmg.default_brl.
  * O LMG nunca deve ser inferior a policy.lmg.default_brl (isso já é garantido pelo uso de max()).
- NÃO invente obrigações fora das regras.

FORMATO DE SAÍDA (APENAS JSON):
{
  "stage": "GERENCIAMENTO_RISCO_LMG",
  "status": "aprovado" | "atenção",
  "matched_rule_ids": ["..."],
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
