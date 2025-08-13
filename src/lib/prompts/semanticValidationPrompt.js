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

export function buildRiskAndLmgPrompt(cteData, policy) {
  const riskPayload = {
    by_goods: policy.risk_rules?.by_goods || [],
    by_shipper: policy.risk_rules?.by_shipper || [],
    operations: policy.risk_rules?.operations || [],
  };

  const GENERIC_FEW_SHOTS = `
EXEMPLOS DIDÁTICOS (GENÉRICOS, NÃO ESPECÍFICOS À APÓLICE ATUAL):
- Exemplo A — Específico → Genérico (por mercadoria):
  • Entrada: goods.name descreve um item muito específico de uma marca/modelo.
  • policy.risk_rules.by_goods lista um termo genérico que abrange esse item.
  • Interpretação: o item específico é hipônimo do termo genérico → deve haver match.
  • Resultado: incluir o id EXATO da regra encontrada em matched_rule_ids; status="atenção".
- Exemplo B — Operação por embarcador:
  • Entrada: shipper.name casa com uma operação listada em policy.risk_rules.operations; goods.value_brl = 2_600_000.
  • Seleção de band: escolher o band cujo range_brl contenha 2600000 e registrar em bands_applied.
  • LMG: comparar policy.lmg.default_brl com o valor 'max' do ÚLTIMO band dessa operação e usar o MAIOR entre eles (sem somar).
- Exemplo C — Exclusões em outra etapa:
  • Mesmo se bens forem reprovados por exclusão, aqui ainda assim reportar matches de risco normalmente.
  • Se matched_rule_ids tiver ao menos 1 id, status="atenção"; caso contrário, "aprovado".
  • LMG segue a regra do maior teto (default vs. últimos bands das regras aplicáveis).
`;

  return `\
${COMMON_RULES}

TAREFA: Avalie GERENCIAMENTO DE RISCO e determine o LMG (Limite Máximo de Garantia) final.
- Sempre execute esta avaliação MESMO que o transporte tenha sido reprovado em outra etapa (ex.: exclusões).
- Avalie INDEPENDENTEMENTE: risk_rules.by_goods, risk_rules.by_shipper e risk_rules.operations.

REGRAS DE MATCH (SEMÂNTICA):
- Compare de forma semântica robusta (sinônimos, hipônimos, genérico↔específico).
- Use SOMENTE ids e obrigações que existirem em policy.risk_rules.* (não invente nada).
- Não confunda exclusões com risco: exclusões ficam em outra etapa, mas aqui você ainda deve encontrar e listar matches de risco, se existirem.

SELEÇÃO DE BANDS E OBRIGAÇÕES:
- Para cada regra aplicável:
  * Selecione o band cujo range_brl contenha goods.value_brl.
  * Adicione esse band em "bands_applied" (inclua rule_id, band_index e range_brl).
  * Combine obrigações de todos os bands aplicáveis (dedupe), sem criar novas obrigações.

STATUS DO GERENCIAMENTO DE RISCO:
- Se matched_rule_ids.length > 0 → "status": "atenção".
- Caso contrário → "status": "aprovado".
- Não use outros valores de status.

CÁLCULO DO LMG:
- Comece com policy.lmg.default_brl.
- Para cada regra aplicável, pegue o valor 'max' do ÚLTIMO band dessa regra.
- LMG final = MAIOR entre todos esses 'max' e o default_brl. Não some valores.
- Se nenhuma regra for aplicável, use apenas o default_brl.

FORMATOS E VALIDAÇÃO:
- Responda APENAS com JSON válido no formato a seguir.
- matched_rule_ids devem ser ids que realmente existam em policy.risk_rules.*.
- lmg_brl NUNCA deve ser menor que policy.lmg.default_brl.

${GENERIC_FEW_SHOTS}

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
