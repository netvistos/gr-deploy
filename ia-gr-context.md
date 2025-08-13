# IA-GR Context Document

## 1. Visão Geral

- **Objetivo Principal:**  
  Validar Conhecimentos de Transporte Eletrônico (CTe) usando regras de apólice e inteligência artificial, automatizando o compliance de transporte de cargas.

- **Público-Alvo:**  
  Empresas de logística, transportadoras, seguradoras e profissionais de gerenciamento de risco.

- **Problemas que Resolve:**

  - Reduz erros manuais na validação de CTe.
  - Automatiza análise de regras complexas de apólice.
  - Garante conformidade regulatória e mitigação de riscos.

- **Tecnologias Principais Usadas:**
  - Next.js (frontend/backend)
  - React (UI)
  - OpenAI API (validação inteligente)
  - JavaScript (lógica principal)
  - dotenv (gestão de variáveis de ambiente)

---

## 2. Arquitetura

### Estrutura de Pastas

```
├── .env / .env.example         # Configuração de variáveis de ambiente
├── files/                      # XMLs de CTe para teste
│   ├── teste1.xml
│   └── ...
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── upload/         # Endpoint para upload de arquivos
│   │   │   └── validate/       # Endpoint para validação de CTe
│   ├── components/
│   │   ├── FileUpload.jsx      # Componente de upload
│   │   ├── ResultCard.jsx      # Exibe resultado da validação
│   ├── lib/
│   │   ├── openaiClient.js     # Integração com OpenAI
│   │   ├── policyRules.js      # Regras de apólice e gerenciamento de risco
│   │   ├── compareCte.js       # Lógica de comparação e validação de CTe
│   │   ├── xmlParser.js        # Parser de XML para JSON
│   │   ├── validateCteUtils.js # Funções utilitárias de validação
├── backups/                    # Prompts e scripts de backup
│   ├── gr.prompt.js
├── .github/
│   ├── copilot-instructions.md # Instruções de boas práticas para IA
├── README.md                   # Documentação principal
```

### Fluxos Internos

- **Upload:**  
  Usuário envia XML via FileUpload.jsx → endpoint /api/upload → arquivo salvo em files/.

- **Validação:**  
  XML é lido e convertido para JSON via xmlParser.js → regras de apólice carregadas de policyRules.js → lógica de validação executada em compareCte.js.

- **Integração com IA:**  
  Prompt gerado e enviado para OpenAI via openaiClient.js → resposta JSON validada e retornada ao frontend.

### Decisões Arquiteturais

- **Separação de responsabilidades:**  
  Cada módulo tem função única (upload, parsing, validação, integração IA).
- **Uso de IA:**  
  OpenAI é usado para decisões complexas e semânticas, reduzindo regras hardcoded.
- **Estrutura modular:**  
  Facilita manutenção e extensibilidade.

---

## 3. Principais Fluxos de Negócio

### 1. Upload de XML

**Passos:**

1. Usuário seleciona arquivo XML.
2. FileUpload.jsx envia para /api/upload.
3. Backend salva em files/.

**Entrada:**  
Arquivo XML (exemplo: teste1.xml)

**Saída:**  
Confirmação de upload.

---

### 2. Validação de CTe

**Passos:**

1. XML é lido e convertido para JSON.
2. Regras de apólice carregadas.
3. compareCte.js executa validação.
4. Prompt é montado e enviado para OpenAI.
5. Resposta JSON é retornada.

**Entrada:**

```xml
<CTe>
  <emitente>CNPJ</emitente>
  <valor>10000</valor>
  <uf_origem>SP</uf_origem>
  <uf_destino>RJ</uf_destino>
  <mercadoria>peças de veículos elétricos</mercadoria>
</CTe>
```

**Saída:**

```json
{
  "status": "reprovado",
  "motivo": "condicao_7: valor 10.000 excede limite 8.000 para peças de veículos elétricos; condicao_6: proibido para origem ou destino RJ"
}
```

---

### 3. Integração com IA

**Passos:**

1. Prompt técnico gerado conforme regras de negócio.
2. openaiClient.js envia para OpenAI.
3. Resposta é parseada e validada.

---

## 4. Dependências-chave

| Biblioteca | Versão | Uso Principal                    |
| ---------- | ------ | -------------------------------- |
| next       | ^13.x  | Framework web (frontend/backend) |
| react      | ^18.x  | UI components                    |
| openai     | ^4.x   | Integração com OpenAI API        |
| dotenv     | ^16.x  | Carregar variáveis de ambiente   |
| xml2js     | ^0.4.x | Conversão de XML para JSON       |
| eslint     | ^8.x   | Padronização e lint do código    |

---

## 5. Padrões e Convenções

- **Nomeação:**

  - Funções: camelCase, verbos no início (validateCte, parseXml)
  - Variáveis: camelCase, nomes descritivos
  - Componentes React: PascalCase

- **Estilo de Código:**

  - Clean code: funções curtas, responsabilidade única
  - Sem overengineering
  - Comentários explicativos apenas onde necessário

- **Commits:**

  - Inglês, semânticos (ex.: feat: add CTe validation flow)
  - Referência: Conventional Commits (https://www.conventionalcommits.org/)

- **Regras de Clean Code:**
  - Evitar duplicidade
  - Modularização
  - Nomes claros e autoexplicativos
  - Tratamento robusto de erros

---

## 6. Integrações Externas

- **OpenAI API:**
  - Usada para validação inteligente de CTe.
  - Consumida via openai e openaiClient.js.
  - Prompt técnico enviado, resposta JSON recebida e parseada.

---

## 7. Exemplo de Uso

**Fluxo Prático:**

1. Usuário faz upload de teste1.xml via interface.
2. Backend salva arquivo em files/.
3. XML é convertido para JSON.
4. Regras de apólice carregadas.
5. Prompt gerado e enviado para OpenAI.
6. Resposta:
   ```json
   {
     "status": "aprovado_condicionado",
     "motivo": "condicao_5: rastreamento obrigatório; condicao_2: análise de perfil profissional"
   }
   ```
7. Resultado exibido em ResultCard.jsx.

---

**Referências Oficiais:**

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev/learn)
- [OpenAI API Docs](https://platform.openai.com/docs/)
- [Conventional Commits](https://www.conventionalcommits.org/)
