# Business Rules - ia-gr

## Visão Geral

Este documento detalha as regras de negócio aplicadas na validação de CTe contra apólices de seguro. O sistema aplica validações em **blocos sequenciais** para garantir conformidade e explicabilidade.

## Fluxo de Validação

### 1. CNPJ do Emitente

- **Critério**: Comparação exata entre CNPJ do XML e CNPJ autorizado na apólice
- **CNPJ autorizado**: `13.657.062/0001-12` (LOGITIME TRANSPORTES LTDA)
- **Normalização**: Remove pontos, traços e barras antes da comparação
- **Status**: `aprovado` | `reprovado`

### 2. Data de Transporte

- **Critério**: Data deve estar dentro do período de vigência da apólice
- **Período vigente**: 2024-10-19 a 2026-10-31
- **Fontes XML**: Prioriza `<dPrev>`, fallback para `<dhEmi>`
- **Status**: `aprovado` | `reprovado`

### 3. Exclusões (Bens Excluídos)

- **Critério**: Comparação semântica da mercadoria com lista de exclusões
- **Tipos de exclusão**:
  - **Geral**: Itens nunca cobertos (joias, dinheiro, armas, etc.)
  - **Condicional por localização**: Alguns itens excluídos apenas se origem/destino = RJ
  - **Especiais**: Mudanças, animais vivos, objetos de arte
- **Status**: `aprovado` | `reprovado`
- **Output**: Array de `matched_rule_ids` e `violations`

### 4. Gerenciamento de Risco

- **Critério**: Aplicação de bandas de risco baseadas em mercadoria, embarcador e operações especiais
- **Categorias**:
  - **RISCO A**: Mercadorias de alto valor (celulares, computadores, medicamentos)
  - **RISCO B**: Mercadorias diversas (autopeças, cosméticos, produtos alimentícios)
  - **Por embarcador**: Regras específicas (MANN+HUMMEL, MIBA)
  - **Operações especiais**: BYD MAN (baterias, painéis solares)
- **Bandas**: Cada regra tem faixas de valor (range_brl) com obrigações específicas
- **Status**: `aprovado` | `atenção`
- **Output**: `matched_rule_ids`, `obligations`, `bands_applied`

### 5. LMG (Limite Máximo de Garantia)

- **LMG padrão**: R$ 3.000.000
- **LMG final**: Maior valor entre padrão e limites das regras de risco aplicáveis
- **Critério**: Valor da mercadoria não pode exceder LMG calculado
- **Status**: `aprovado` | `reprovado`

## Exemplos de Comparação Semântica

### Mercadorias

- `"taco de beisebol"` → `"artigos esportivos"` ✅
- `"filtro de ar"` → `"filtro de ar para veículos"` ✅
- `"MANN+HUMMEL"` → `"MANN+HUMMEL BRASIL LTDA"` ✅

### Critérios Aplicados

- **semantic_in**: Item está na lista (com variações)
- **semantic_equals**: Equivalência semântica
- **semantic_contains_all**: Contém todos os termos especificados

## Bandas de Risco - Exemplos

### RISCO A - Computadores

| Valor (BRL)         | Obrigações                                                 |
| ------------------- | ---------------------------------------------------------- |
| 0 - 40.000          | análise de perfil profissional                             |
| 40.001 - 350.000    | análise + rastreamento                                     |
| 350.001 - 600.000   | análise + rastreamento + (escolta OU isca OU imobilizador) |
| 600.001 - 1.000.000 | análise + rastreamento + (escolta OU imobilizador+isca)    |

### BYD MAN - Painel Solar

| Valor (BRL)            | Obrigações                                     |
| ---------------------- | ---------------------------------------------- |
| 0 - 80.000             | análise de perfil profissional                 |
| 3.000.001 - 5.000.000  | 02 escoltas + 02 iscas + imobilizador + fiscal |
| 7.000.001 - 10.000.000 | 03 escoltas + 02 iscas + imobilizador + fiscal |

## Regras Especiais

### Localização (RJ)

- Algumas exclusões aplicam-se apenas se origem OU destino = RJ
- Operação MIBA tem regra específica se origem OU destino ≠ RJ

### Operações Dedicadas

- **BYD MAN**: Embarcador específico com regras diferenciadas para baterias de veículos elétricos e painéis solares
- **MANN+HUMMEL**: Embarcador com bandas próprias independente da mercadoria

## Status Consolidado

O status final da validação segue a hierarquia:

1. `reprovado` (se qualquer etapa reprovar)
2. `atenção` (se alguma etapa tiver atenção e nenhuma reprovar)
3. `aprovado` (se todas as etapas aprovarem)
