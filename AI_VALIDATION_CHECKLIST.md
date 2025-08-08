# 🔍 CHECKLIST DE VALIDAÇÃO IA - CTe vs Apólice

## 📌 **PONTOS CRÍTICOS PARA CORREÇÃO OBRIGATÓRIA**

### 🚨 **1. FORMATAÇÃO E PADRONIZAÇÃO DE DADOS**

#### **CNPJ - Normalização Crítica**
- [ ] **Problema**: CNPJ pode vir formatado (00.000.000/0000-00) ou sem formatação (00000000000000)
- [ ] **Exemplo CTe**: `32606932000179` (sem pontuação)
- [ ] **Exemplo Apólice**: `13.657.062/0001-12` (com pontuação)
- [ ] **Solução**: Criar função de normalização que remove pontuação antes da comparação
- [ ] **Implementar**: Função `normalizeCNPJ(cnpj)` que retorna apenas números

#### **Datas - Formatação Inconsistente**
- [ ] **Problema**: CTe usa ISO (2025-01-27T14:09:42-03:00) vs Apólice DD/MM/YYYY
- [ ] **Exemplo CTe**: `2025-01-27T14:09:42-03:00`
- [ ] **Exemplo Apólice**: `19/10/2024 até 31/10/2026`
- [ ] **Solução**: Parser de datas que converte ambos formatos para Date object
- [ ] **Implementar**: Função `parseDate(dateString)` com fallbacks para diferentes formatos

#### **Valores Monetários - Precisão Decimal**
- [ ] **Problema**: CTe usa decimal (109308.39) vs Apólice com formatação brasileira
- [ ] **Exemplo CTe**: `109308.39` (valor da carga)
- [ ] **Exemplo Apólice**: `R$ 40.000,00` (regras de risco)
- [ ] **Solução**: Normalizar para número decimal sem formatação
- [ ] **Implementar**: Função `parseValue(valueString)` que remove R$, pontos e converte vírgulas

### 🎯 **2. VALIDAÇÃO SEMÂNTICA DE MERCADORIAS**

#### **Matching Inteligente de Produtos**
- [ ] **Problema**: Descrições podem ser similares mas não idênticas
- [ ] **Exemplo CTe**: `"LIVROS DIDATICOS PARA SEREM UTILIZADOS EM DEPARTAMENTOS CULT"`
- [ ] **Exemplo Apólice**: `"Aparelhos de telefonia Celular, suas partes, peças e acessórios"`
- [ ] **Solução**: Implementar matching por palavras-chave e sinônimos
- [ ] **Implementar**: Lista de sinônimos e palavras-chave para cada categoria de mercadoria

#### **Categorização de Produtos**
- [ ] **Problema**: Um produto pode se enquadrar em múltiplas categorias
- [ ] **Exemplo**: "Notebook Dell" pode ser "Computador", "Eletrônico" ou "Produto Tecnológico"
- [ ] **Solução**: Hierarchy de categorias com priorização
- [ ] **Implementar**: Mapa de categorização hierárquica de produtos

### 🌍 **3. VALIDAÇÃO GEOGRÁFICA**

#### **Origem e Destino - Estados**
- [ ] **Problema**: CTe tem códigos IBGE vs Apólice usa nomes de estados
- [ ] **Exemplo CTe**: `UFIni: "SP"`, `UFFim: "SP"` (códigos UF)
- [ ] **Exemplo Apólice**: `"Estado do Rio de Janeiro"` (nome completo)
- [ ] **Solução**: Mapa de conversão UF ↔ Nome completo do estado
- [ ] **Implementar**: Dicionário `UF_TO_STATE` e `STATE_TO_UF`

#### **Municípios - Códigos IBGE**
- [ ] **Problema**: CTe usa códigos IBGE de municípios vs nomes
- [ ] **Exemplo CTe**: `cMunIni: "3509502"` (Campinas), `cMunFim: "3526902"` (Limeira)
- [ ] **Solução**: Base de dados ou API para conversão código → município → UF
- [ ] **Implementar**: Função `getMunicipalityInfo(ibgeCode)` retornando {nome, uf}

### 🔧 **4. LÓGICA DE NEGÓCIO - REGRAS COMPLEXAS**

#### **Regra 6 - Limite de Cobertura (CRÍTICO)**
- [ ] **Problema**: Lógica confusa sobre quando aplicar R$ 3.000.000 vs valor da apólice
- [ ] **Regra Atual**: "Se aprovado nas regras 3,4,5 → R$ 3.000.000, senão valor da apólice"
- [ ] **Correção**: Especificar que se REPROVADO em alguma regra → sem cobertura
- [ ] **Implementar**: Lógica clara: `aprovado_todas_regras ? "3.000.000,00" : valor_especifico_apolice`

#### **Regras de Gerenciamento de Riscos - Valores**
- [ ] **Problema**: Regras A e B têm thresholds de valor que precisam ser comparados
- [ ] **Exemplo**: Risco A ≥ R$ 40.000, Risco B ≥ R$ 100.000
- [ ] **Solução**: Comparação numérica precisa após normalização
- [ ] **Implementar**: Função `checkRiskCategory(productType, value)` retorna categoria

#### **Exclusões Geográficas - Rio de Janeiro**
- [ ] **Problema**: Regra específica para origem E destino no RJ
- [ ] **Condição**: "Se origem E destino = RJ → mercadorias específicas proibidas"
- [ ] **Solução**: Validação de ambos origem E destino antes de aplicar exclusão
- [ ] **Implementar**: `isRioJaneiroRoute(origin, destination)` → boolean

### 📊 **5. ESTRUTURA DE RESPOSTA JSON**

#### **Padronização de Status**
- [ ] **Problema**: Status "aprovado|reprovado" pode ser inconsistente
- [ ] **Solução**: Enum fixo: `["aprovado", "reprovado"]`
- [ ] **Implementar**: Validação de status antes de retornar JSON

#### **Campos Obrigatórios**
- [ ] **Problema**: Campos podem vir `null`, `undefined` ou vazios
- [ ] **Solução**: Valores default para todos os campos obrigatórios
- [ ] **Implementar**: Schema de validação de resposta com defaults

#### **Motivos Específicos**
- [ ] **Problema**: Motivos genéricos não ajudam no debugging
- [ ] **Solução**: Templates de motivos específicos por tipo de reprovação
- [ ] **Implementar**: Dicionário de templates: `REJECTION_REASONS[ruleType][subtype]`

### 🧪 **6. CASOS DE TESTE - EXEMPLOS REAIS**

#### **Cenário 1: CTe teste1.xml**
```json
{
  "cnpj_cte": "32606932000179",
  "cnpj_apolice": "13657062000112",
  "data_cte": "2025-01-27",
  "vigencia_apolice": "19/10/2024 até 31/10/2026",
  "mercadoria": "LIVROS DIDATICOS",
  "valor_carga": "109308.39",
  "origem": "SP", 
  "destino": "SP"
}
```

#### **Validações Esperadas:**
- [ ] **CNPJ**: REPROVADO (CNPJs diferentes após normalização)
- [ ] **Vigência**: APROVADO (27/01/2025 dentro do período)
- [ ] **Mercadoria**: APROVADO (livros não estão na lista de exclusão)
- [ ] **Risco**: Verificar se livros se enquadram em categoria A ou B
- [ ] **Geografia**: APROVADO (SP → SP, não é RJ)
- [ ] **Limite**: R$ 3.000.000 se aprovado nas outras regras

### 🔄 **7. MELHORIAS NO SYSTEM PROMPT**

#### **Instruções Mais Específicas**
```markdown
INSTRUÇÕES TÉCNICAS DETALHADAS:

1 - cnpj: 
   - SEMPRE normalizar removendo pontuação antes da comparação
   - Comparar apenas os 14 dígitos numéricos
   - Exemplo: "32.606.932/0001-79" = "32606932000179"

2 - vigencia:
   - Converter data do CTe para formato DD/MM/YYYY
   - Extrair data inicial e final da vigência da apólice
   - Validar se data_cte >= data_inicial AND data_cte <= data_final

3 - mercadoria_excluida:
   - Usar matching por palavras-chave (não exato)
   - Verificar sinônimos: "celular" = "telefone móvel" = "smartphone"
   - Aplicar exclusões geográficas APENAS se origem E destino = RJ

4 - regras_gerenciamento_de_riscos:
   - Normalizar valor da carga removendo formatação
   - Classificar produto em categoria A ou B
   - Aplicar threshold correspondente (A: ≥40k, B: ≥100k)

5 - clausula_especifica_de_exclusao:
   - Verificar palavras-chave: "químic", "biológic", "eletromagnét"

6 - limite_de_cobertura:
   - SE todas regras anteriores = "aprovado" → "3.000.000,00"
   - SE alguma regra = "reprovado" → "0,00" (sem cobertura)
```

### ✅ **CRITÉRIOS DE SUCESSO**

Uma validação está **CONSISTENTE** quando:
- [ ] Mesmos dados de entrada produzem sempre a mesma resposta
- [ ] Formatação de dados é normalizada antes da comparação  
- [ ] Matching de mercadorias funciona com sinônimos e variações
- [ ] Regras geográficas são aplicadas corretamente
- [ ] Valores monetários são comparados numericamente
- [ ] JSON de resposta está sempre válido e completo
- [ ] Motivos de reprovação são específicos e úteis
- [ ] Logs permitem debug e auditoria das decisões

### 🎯 **PRÓXIMOS PASSOS RECOMENDADOS**

1. **Implementar funções utilitárias** (normalização, parsing)
2. **Criar mapa de sinônimos** para mercadorias
3. **Testar com todos os XMLs** da pasta `/files/`
4. **Validar consistência** executando mesma validação 5x
5. **Ajustar temperature** para 0.0 se necessário
6. **Criar logs detalhados** de cada decisão da IA
7. **Implementar cache** para respostas idênticas

---

*Este checklist deve ser revisado após cada implementação e teste com dados reais.*