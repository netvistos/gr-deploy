# IA-GR: Validação de CTe com Inteligência Artificial

Este projeto é uma aplicação web desenvolvida com Next.js para validação de Conhecimento de Transporte Eletrônico (CTe) utilizando regras de apólice e inteligência artificial (OpenAI). O sistema permite o upload de arquivos XML de CTe, realiza validações automáticas e retorna o resultado ao usuário.

## Funcionalidades
- Upload de arquivos XML de CTe
- Validação de CNPJ do emitente
- Verificação de vigência da apólice
- Análise de bens e mercadorias excluídas via IA (OpenAI)
- Validação de regras de gerenciamento de risco
- Retorno estruturado do resultado da validação

## Estrutura do Projeto
```
├── components.json
├── eslint.config.mjs
├── jsconfig.json
├── next.config.mjs
├── package.json
├── postcss.config.mjs
├── files/                # Arquivos XML de CTe para teste
│   ├── teste1.xml
│   └── ...
├── src/
│   ├── app/
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   ├── layout.js
│   │   ├── page.js
│   │   └── api/
│   │       ├── upload/   # Endpoint para upload de arquivos
│   │       └── validate/ # Endpoint para validação de CTe
│   ├── components/
│   │   ├── FileUpload.jsx
│   │   ├── LoadingSpinner.jsx
│   │   └── ResultCard.jsx
│   └── lib/
│       ├── mockCte.js
│       ├── openaiClient.js
│       ├── policyRules.js
│       ├── validateCTe.js
│       ├── xmlParser.js
│       └── xmlUtils.js
```

## Como Executar
1. Instale as dependências:
   ```pwsh
   npm install
   ```
2. Inicie o servidor de desenvolvimento:
   ```pwsh
   npm run dev
   ```
3. Acesse `http://localhost:3000` no navegador.

## Configuração
- Adicione sua chave da OpenAI em um arquivo de ambiente, se necessário.
- Os arquivos de apólice e regras estão em `src/lib/policyRules.js`.
- Os arquivos XML de teste estão em `files/`.

## Principais Arquivos
- `src/app/api/validate/route.js`: Lógica principal de validação do CTe.
- `src/lib/openaiClient.js`: Integração com OpenAI para validação inteligente.
- `src/components/FileUpload.jsx`: Componente de upload de arquivos.

## Tecnologias Utilizadas
- Next.js
- React
- OpenAI API
- JavaScript

## Licença
Este projeto é privado e para uso interno.
