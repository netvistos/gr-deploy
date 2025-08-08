# CHECKLIST-DE-CONSISTENCIA.md

Este checklist reúne os pontos obrigatórios para obter resultados consistentes ao validar CTe (XML) contra as regras da apólice via IA.

Links oficiais:

- OpenAI Structured Outputs: https://platform.openai.com/docs/guides/structured-outputs
- OpenAI Node SDK (chat): https://platform.openai.com/docs/libraries/node-js
- xml2js: https://www.npmjs.com/package/xml2js

### 1) Retorno da IA: JSON válido e estável

- [ ] Exemplo de JSON no `systemPrompt` deve ser JSON válido (chaves com aspas, sem vírgulas finais).
- [ ] Padronizar os nomes das chaves: usar sempre `regras_gerencia_de_riscos` OU `regras_gerenciamento_de_riscos` (escolher uma forma e manter).
- [ ] Definir política para dados ausentes: se faltar campo essencial (CNPJ, data, mercadoria, valor), marcar `status: "reprovado"` e `motivo: "dado_ausente:<campo>"` (ou usar `inconclusivo`, se for adotar).
- [ ] Explicitar formatos:
  - CNPJ como apenas dígitos (`"00000000000000"`).
  - Data do CTe no padrão `"DD/MM/YYYY"` (compatível com sua formatação atual).
  - Valor monetário em string normalizada e consistente (sugestão: `"3000000.00"` ou `"3.000.000,00"` e manter igual em toda a aplicação).

### 2) Nomes e regras no `systemPrompt`

- [ ] Remover ambiguidade do item `limite_de_cobertura`. Regra sugerida (clara e determinística):
  - Se qualquer uma entre `mercadoria_excluida`, `regras_gerencia_de_riscos`, `clausula_especifica_de_exclusao` estiver `"reprovado"` → `limite_de_cobertura.status = "reprovado"` e `valor = "0" | "sem_cobertura"`.
  - Caso contrário → `limite_de_cobertura.status = "aprovado"` e `valor = "3000000.00"` (ou o valor específico da apólice, se aplicável).
- [ ] Alinhar exatamente o nome da seção de “regras de risco” com o que será consumido no frontend/backend.
- [ ] Retirar instruções vagas como “Use variações semânticas”; priorizar precisão determinística.

### 3) Normalização de entrada (antes de chamar a IA)

- [ ] Normalizar CNPJ do CTe e o CNPJ da apólice para apenas dígitos, para comparação exata.
- [ ] Garantir data do CTe no formato `"DD/MM/YYYY"` (você já formata assim).
- [ ] Garantir que `valorMercadoria` usado na classificação de risco siga uma mesma fonte:
  - Definir se o valor vem de `vCarga` ou `vCargaAverb` (em `files/teste1.xml`, ambos existem). Sugerido: usar `vCargaAverb` quando existir; senão `vCarga`.

### 4) Extrações do XML que são necessárias

- [ ] Incluir `compl.xObs` nos dados enviados à IA (muitos detalhes práticos estão ali, ex.: “Truck blindado”, “escolta”, “seguradora/apólice informada”). Hoje só `natOp` é enviado.
- [ ] Confirmar UF de origem e destino (`UFIni`, `UFFim`) para aplicar a regra de proibição no RJ (ver policy `condicao2`).
- [ ] Extrair ou inferir indícios de tipo de veículo usado (para regra de “veículos permitidos” em `condicao4`). Se não disponível no XML, documentar a limitação e exigir evidência via `xObs`.

Exemplos de `files/`:

- `files/teste5.xml`, `files/teste6.xml`, `files/teste7.xml` contêm `xObs` com “Truck blindado”, “apólice: 17540034120.28”, “Motorista… Placa…”. Esses dados são cruciais para cruzar com as regras práticas (escolta/monitoramento, etc.).

### 5) Mapeamento semântico de mercadorias (CTe → Política)

- [ ] Criar normalização mínima (lowercase, remoção de acentos e stopwords) para `mercadoria` antes de comparar.
- [ ] Definir fallback para descrições genéricas/ambíguas:
  - Ex.: `files/teste3.xml` (“PARTES E PECAS”) → ambíguo: decidir “inconclusivo” ou solicitar evidência adicional.
- [ ] Exemplos úteis:
  - `files/teste1.xml` (“LIVROS DIDATICOS…”) → mapear para “Livros e revistas em geral” (Risco B).
  - `files/teste2.xml` (“TANQUE DE PULVERIZACAO”) → mapear para “Tratores, máquinas e implementos agrícolas” (Risco B).
  - `files/teste4.xml` (“DRONE”) → mapear para categoria eletrônica adequada (ver itens de risco A/B mais próximos; documentar a escolha).
  - `files/teste5/6/7.xml` (“Outros”) → ambíguo: definir regra de fallback (ex.: “inconclusivo” + motivo).

### 6) CNPJ: qual ator comparar?

- [ ] Documentar claramente qual CNPJ do CTe será comparado com a apólice:
  - Hoje o parser usa `emit.CNPJ`. Está correto para seu caso? Avaliar se deveria considerar tomador/remetente quando o contrato exigir.
- [ ] Ex.: nos XMLs `teste5/6/7`, o emitente é `VNS TRANSPORTES LTDA (22165703000102)`, enquanto na apólice atual (`policy-rules.js`) é `LOGITIME TRANSPORTES LTDA (13.657.062/0001-12)`. Esperar “reprovado”.

### 7) Regras de Gerenciamento de Riscos

- [ ] Confirmar que a IA deve classificar a mercadoria no “Risco A/B ou específicos” com base no valor (após normalização).
- [ ] Se a mercadoria não se enquadrar em nenhuma lista, aplicar regra “padrão” (ver seção limite de cobertura).
- [ ] Se qualquer obrigatoriedade (ex.: escolta, rastreamento) for exigida pela faixa de valor e não houver evidência no CTe/`xObs`, marcar “reprovado” com `motivo` objetivo (ex.: “faltou escolta armada”).

### 8) Padronização de formatos (consumo e UI)

- [ ] Decidir formato definitivo de moeda no JSON de saída e manter consistente (ex.: `"3000000.00"`).
- [ ] Confirmar nomes das chaves usados no frontend (`ResultCard`) para evitar quebras por renome (snake_case vs camelCase).
- [ ] Incluir no JSON retornado referências ao item/regra da apólice que fundamentou o “reprovado” (ex.: “condicao2 / riscoA-3”).

### 9) Bugs e inconsistências no código atual

- [ ] `src/lib/xml-parser.js` → `formatDataForAI`: usa `extractedData.transporte.dataTransporte`, mas `dataTransporte` é top-level. Corrigir para `extractedData.dataTransporte`.
- [ ] `src/lib/openai-client.js` → exemplo de JSON no `systemPrompt` inválido e chaves inconsistentes (“regras_gerenciamento_de_riscos” vs “regras_gerencia_de_riscos”). Corrigir.
- [ ] Modelo “gpt-4.1-nano-2025-04-14”: confirmar disponibilidade/estabilidade; se instável, usar um modelo suportado e com melhor raciocínio para regras longas (ex.: `gpt-4o-mini`) mantendo `response_format: { type: "json_object" }`.

### 10) Testes mínimos com os XMLs de exemplo (esperado)

- [ ] `files/teste1.xml`:
  - CNPJ: diferente da apólice → “reprovado”.
  - Vigência: data 2025-01-27 → dentro da janela “19/10/2024 até 31/10/2026” → “aprovado”.
  - Mercadoria: “LIVROS DIDATICOS…” → mapear para “Livros e revistas em geral” (Risco B). Checar faixa de valor `vCargaAverb/vCarga` 109.308,39 e aplicar obrigações de risco correspondentes.
- [ ] `files/teste2.xml`:
  - Mercadoria “TANQUE DE PULVERIZACAO”; valor 291.854,62 → obrigações de risco (ver Risco aplicável) e evidências em `xObs`.
- [ ] `files/teste4.xml`:
  - Mercadoria “DRONE”; verificar mapeamento para categoria eletrônica e obrigações por valor 91.654,50.
- [ ] `files/teste5/6/7.xml`:
  - `xObs` indica “Truck blindado”; conferir se atende “escolta”/“monitoramento” quando exigido pela faixa de valor (valores elevados: até milhões). Se não houver evidência suficiente, tratar como não cumprido e “reprovado”.

### 11) Observabilidade e erros

- [ ] Logar motivo estruturado quando a IA retornar “reprovado” (qual regra, qual valor, qual evidência faltou).
- [ ] Tratar `response` vazio/JSON inválido (já existe tratamento básico); manter retry simples e alerta de falha.
