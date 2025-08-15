export function buildSemanticValidationPrompt(
  cteData,
  policyRules,
  policyBags
) {
  return `
Você é um validador de Conhecimento de Transporte Eletrônico (CTe) que aplica as regras de uma apólice de seguro.

Regras importantes:
- NÃO reavalie CNPJ e datas (já validados fora desta etapa).
- Compare SEMANTICAMENTE os campos textuais (mercadoria, embarcador, origem/destino).
- Use equivalências, sinônimos, hipônimos e termos genéricos ↔ específicos.
- A descrição completa da mercadoria vem no campo goods.name.
- Use os termos expandidos do "policyBags" como referência adicional de semântica.
- Responda APENAS com JSON válido no formato solicitado.
- Formato da resposta:
{
  "status": "aprovado" | "reprovado" | "atenção",
  "motivo": "texto explicando o motivo",
  "matched_rule_ids": ["id1", "id2"]
}

Dados do CTe:
${JSON.stringify(cteData, null, 2)}

Regras da apólice (com termos expandidos):
${JSON.stringify(
  policyRules.exclusions.map((rule) => ({
    id: rule.id,
    title: rule.title,
    criteria: rule.criteria,
    bag: policyBags[rule.id] || [],
  })),
  null,
  2
)}
Compare o CTe com as regras acima e determine se alguma delas se aplica.
  `;
}
