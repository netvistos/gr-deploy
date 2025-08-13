/**
 * Prompt para o bloco "Exclusões".
 */
export function buildExclusionsPrompt(cteData, policy) {
  return `\
TAREFA: Avalie APENAS EXCLUSÕES com base em policy.exclusions.
- Analise TODAS as regras listadas em policy.exclusions.
- O campo "matched_rule_ids" deve conter TODAS as IDs das regras que se aplicarem ao CTe.
- O campo "violations" deve conter TODOS os textos explicativos das regras que se aplicarem, na mesma ordem das IDs.
- Se pelo menos UMA regra se aplicar, o status deve ser "reprovado".
- Se nenhuma regra se aplicar, status deve ser "aprovado" e arrays vazios.
- NÃO inventar regras ou IDs que não estejam na policy.
- Comparar SEMANTICAMENTE mercadoria, embarcador, origem e destino.

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
  return `\
TAREFA: Avalie GERENCIAMENTO DE RISCO.
- Execute esta avaliação mesmo que o transporte tenha sido reprovado em outra etapa.
- Verifique critérios em risk_rules.by_goods, risk_rules.by_shipper e risk_rules.operations.
- Para cada REGRA APLICÁVEL:
  * Selecione o band cujo range_brl contenha goods.value_brl.
  * Inclua esse band em "bands_applied" com: rule_id e band_index.
  * Combine as obrigações de todas as bands aplicáveis, sem criar novas obrigações além do policy.
- Definição de STATUS:
  * Se existir ao menos uma REGRA APLICÁVEL ⇒ "status": "atenção".
  * Caso contrário ⇒ "status": "aprovado".

FORMATO DE SAÍDA (APENAS JSON):
{
  "stage": "GERENCIAMENTO_RISCO",
  "status": "aprovado" | "atenção",
  "matched_rule_ids": ["..."],
  "obligations": ["..."],
  "bands_applied": [{"rule_id":"...", "band_index":0}]
}

POLICY.risk_rules:
${JSON.stringify(policy.risk_rules || {}, null, 2)}

CTE:
${JSON.stringify(cteData, null, 2)}
`;
}
