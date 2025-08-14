# Troubleshooting - ia-gr

## Problemas Comuns e Soluções

### 1. Problemas com OpenAI API

#### Erro: "Resposta vazia da OpenAI"

**Causa**: A API retornou uma resposta sem conteúdo  
**Solução**:

- Verifique se `OPENAI_API_KEY` está configurada corretamente
- Confirme se há saldo/créditos na conta OpenAI
- Verifique se o modelo `gpt-5-mini-2025-08-07` está disponível

#### Erro: "Falha na validação: JSON parse error"

**Causa**: O modelo retornou texto que não é JSON válido  
**Solução**:

- Revisar prompts em `src/lib/prompts/semanticValidationPrompt.js`
- Verificar se o prompt instrui claramente "responda APENAS com JSON"
- Testar prompts isoladamente com modelos diferentes
- Considerar ajustar `temperature` para 0 para respostas mais consistentes

#### Erro: "Request failed with status 429"

**Causa**: Rate limit da OpenAI excedido  
**Solução**:

- Implementar retry com backoff exponencial
- Reduzir frequência de chamadas
- Verificar limites da conta OpenAI

### 2. Problemas com XML Parsing

#### Erro: "Arquivo XML inválido ou não é um CTe"

**Causa**: XML não contém tags obrigatórias ou estrutura inválida  
**Solução**:

- Verificar se XML contém: `<cteProc>`, `<CTe>`, `<infCte>`
- Validar estrutura XML com parser externo
- Conferir encoding do arquivo (deve ser UTF-8)

#### Erro: "Estrutura XML inválida - CTe não encontrado"

**Causa**: Parser conseguiu ler XML mas não encontrou estrutura esperada  
**Solução**:

- Verificar caminho: `result.cteProc?.CTe?.infCte`
- Comparar com CTe válido conhecido
- Verificar se não há namespaces não tratados

#### Dados extraídos incorretos

**Problema**: Campos vazios ou valores errados no `cteData`  
**Solução**:

- Verificar mapeamento em `src/lib/xmlParser.js`
- Conferir se XML usa tags padrão (emit, rem, infCarga, etc.)
- Testar com XML de exemplo conhecido

### 3. Problemas com Prompts e Comparação Semântica

#### IA não reconhece correspondências óbvias

**Exemplo**: "taco de beisebol" não bate com "artigos esportivos"  
**Solução**:

- Revisar prompt para incluir exemplos específicos
- Adicionar instruções sobre sinônimos e termos genéricos
- Testar com diferentes modelos (GPT-4 vs GPT-3.5)
- Considerar usar embeddings para comparação mais robusta

#### Falsos positivos em exclusões

**Problema**: IA marca como excluído mercadorias que não deveriam ser  
**Solução**:

- Refinar instruções para ser mais específico sobre critérios
- Adicionar exemplos negativos no prompt
- Revisar lista de exclusões para ambiguidades
- Implementar validação dupla para casos edge

#### Status inconsistente entre execuções

**Problema**: Mesmo CTe gera resultados diferentes  
**Solução**:

- Definir `temperature: 0` para respostas determinísticas
- Implementar cache de respostas para entradas idênticas
- Adicionar validação de consistência nos resultados

### 4. Problemas de Performance

#### Validação muito lenta

**Causa**: Múltiplas chamadas OpenAI em sequência  
**Solução**:

- Considerar paralelizar chamadas independentes
- Implementar cache para regras já validadas
- Otimizar prompts para reduzir tokens

#### Timeout em uploads grandes

**Causa**: XML muito grande ou processing lento  
**Solução**:

- Implementar limite de tamanho de arquivo
- Adicionar progress indicators
- Considerar processamento assíncrono

### 5. Problemas de Desenvolvimento

#### Testes falhando após mudança de prompt

**Problema**: Alterar prompt quebra testes existentes  
**Solução**:

- Atualizar casos de teste em `tests/` quando mudar formato JSON
- Usar fixtures com respostas esperadas
- Implementar testes de contrato para validar schema JSON

#### Environment variables não carregadas

**Problema**: `OPENAI_API_KEY` undefined  
**Solução**:

- Verificar se `.env` existe na raiz do projeto
- Confirmar se `dotenv.config()` é chamado antes de usar variáveis
- Para desenvolvimento, verificar se `.env.local` é carregado pelo Next.js

#### Build falha em produção

**Problema**: Funciona localmente mas falha no deploy  
**Solução**:

- Verificar se todas as env vars estão configuradas no ambiente de produção
- Conferir se dependências estão corretas no `package.json`
- Validar se paths absolutos estão corretos (usar `@/` alias)

### 6. Debugging Tips

#### Visualizar prompts enviados

```javascript
console.log("Prompt enviado:", prompt);
const result = await validateCTeWithAI(prompt);
console.log("Resposta IA:", result);
```

#### Testar parsing XML isoladamente

```javascript
import { parseCTeXML } from "@/lib/xmlParser";
const xmlContent = fs.readFileSync("exemplo.xml", "utf8");
const result = parseCTeXML(xmlContent);
console.log(JSON.stringify(result, null, 2));
```

#### Validar estrutura de resposta IA

```javascript
// Adicionar em openaiClient.js
try {
  const parsed = JSON.parse(response);
  // Validar campos obrigatórios
  if (!parsed.stage || !parsed.status) {
    throw new Error("Resposta IA com formato inválido");
  }
  return parsed;
} catch (error) {
  console.error("Erro parse JSON:", response);
  throw error;
}
```

### 7. Logs Úteis

#### Habilitar logs detalhados

```javascript
// Em openaiClient.js
console.log("Enviando para OpenAI:", {
  model: "gpt-5-mini-2025-08-07",
  promptLength: userPrompt.length,
});
```

#### Monitorar performance

```javascript
// Em compareCte.js
const startTime = Date.now();
const result = await validateCTeWithAI(prompt);
console.log(`Validação levou ${Date.now() - startTime}ms`);
```

### 8. Contatos e Recursos

#### Quando escalar o problema

- Respostas IA inconsistentes por > 24h → Verificar status OpenAI
- Performance degradada > 10s → Revisar prompts ou considerar modelo mais rápido
- Falhas de parsing em XMLs válidos → Bug no parser, precisa correção

#### Recursos externos

- [OpenAI Status](https://status.openai.com/)
- [CTe Layout Oficial](http://www.nfe.fazenda.gov.br/portal/listaConteudo.aspx?tipoConteudo=BMPFMBoln3w=)
- [Documentação xml2js](https://www.npmjs.com/package/xml2js)
