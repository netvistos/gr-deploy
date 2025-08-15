const COMMON_RULES = `\
Você é um validador de CTe (Conhecimento de Transporte Eletrônico) que aplica uma apólice.
- Compare SEMANTICAMENTE os campos textuais (mercadoria, embarcador, origem/destino), com PRIORIDADE:
  (P1) correspondência exata ou sinônimo estrito;
  (P2) categoria/hiperônimo somente se a policy declarar explicitamente a categoria como abrangente para o item e houver evidência textual forte;
  (P3) EVITE generalizações que mudem a natureza do item (ex.: mobiliário com motor ≠ eletrodoméstico), a menos que a policy cite exemplo explícito.
- Regra específica: itens de MOBILIÁRIO (cadeira, poltrona, sofá, estante, mesa), mesmo com motor/eletricidade, NÃO são "eletrodomésticos" a menos que a policy traga o termo exato do item como exemplo de eletrodoméstico.
- A descrição completa da mercadoria vem em goods.name.
- Use IDs de regras da apólice para justificar enquadramentos (matched_rule_ids).
- Para qualquer correspondência, forneça evidências textuais curtas (trechos do CTe e da policy) que suportem a decisão.
- Responda APENAS com JSON válido no formato solicitado.
`;

export function buildExclusionsPrompt(cteData, policy) {
  return `\
${COMMON_RULES}

TAREFA: Avalie APENAS EXCLUSÕES com base em policy.exclusions.
- Analise TODAS as regras listadas em policy.exclusions.
- O campo "matched_rule_ids" deve conter TODAS as IDs das regras que se aplicarem ao CTe.
- O campo "violations" deve conter TODOS os textos explicativos das regras que se aplicarem, na mesma ordem das IDs.
- Se pelo menos UMA regra se aplicar, o status deve ser "reprovado".
- Se nenhuma regra se aplicar, status deve ser "aprovado" e arrays vazios.
- NÃO inventar regras ou IDs que não estejam na policy.
- Comparar SEMANTICAMENTE mercadoria, embarcador, origem e destino seguindo as prioridades (P1→P3) descritas em COMMON_RULES.
- Inclua "evidence" com pares { from_cte, from_policy } para cada matched_rule_id.

FORMATO DE SAÍDA (APENAS JSON):
{
  "stage": "BENS_EXCLUIDOS",
  "status": "aprovado" | "reprovado",
  "matched_rule_ids": ["excl-..."],
  "violations": ["..."],
  "evidence": [{"rule_id":"excl-...","from_cte":"...","from_policy":"..."}]
}

POLICY.exclusions:
${JSON.stringify(policy.exclusions, null, 2)}

CTE:
${JSON.stringify(cteData, null, 2)}
`;
}

export function buildRiskPrompt(cteData, policy) {
  return `\
${COMMON_RULES}

TAREFA: Avalie GERENCIAMENTO DE RISCO.
- Verifique critérios em risk_rules.by_goods, risk_rules.by_shipper e risk_rules.operations.
- Para cada REGRA APLICÁVEL:
  * Selecione o band cujo range_brl contenha goods.value_brl.
  * Inclua esse band em "bands_applied" com: rule_id e band_index.
  * Combine as obrigações de todas as bands aplicáveis, sem criar novas obrigações além do policy.
- Definição de STATUS:
  * Se existir ao menos uma REGRA APLICÁVEL ⇒ "status": "atenção".
  * Caso contrário ⇒ "status": "aprovado".
  * "racional": enumere qual(is) REGRAS APLICÁVEIS foram consideradas. Sempre mencione se existir mais de uma regra aplicável.

FORMATO DE SAÍDA (APENAS JSON):
{
  "stage": "GERENCIAMENTO_RISCO",
  "status": "aprovado" | "atenção",
  "matched_rule_ids": ["..."],
  "obligations": ["..."],
  "bands_applied": [{"rule_id":"...", "band_index":0}],
  "racional": "texto com a justificativa",
}

POLICY.risk_rules:
${JSON.stringify(policy.risk_rules || {}, null, 2)}

CTE:
${JSON.stringify(cteData, null, 2)}
`;
}
