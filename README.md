# 🚛 Validador CTe com IA

[![Next.js](https://img.shields.io/badge/Next.js-15.4.5-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.1.0-blue)](https://reactjs.org/)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4-green)](https://openai.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

Sistema inteligente para validação de Conhecimento de Transporte Eletrônico (CTe) utilizando IA (GPT-4) para verificar conformidade com apólices de seguro de transporte.

---

## ✨ Funcionalidades

- Upload e validação automática de XML de CTe
- Formulário manual com validação em tempo real e máscaras
- Análise de conformidade com IA
- Resultados visuais: Conforme, Não Conforme, Avisos, IA

---

## 🛠️ Tecnologias

- **Frontend**: Next.js 15.4.5 + React 19.1.0
- **Styling**: Tailwind CSS 4 + Radix UI
- **IA**: OpenAI GPT-4
- **Processamento**: XML2JS
- **Estado**: React Hooks
- **Banco de dados**: SQLite, PostgreSQL

---

## 🚀 Como Usar

### Pré-requisitos

- Node.js 18+
- NPM 8+ ou Yarn 1.22+
- Chave da API OpenAI ([Obter aqui](https://platform.openai.com/api-keys))
- Git

### Instalação

1. Clone o repositório:
    ```bash
    git clone https://github.com/seu-usuario/ia-gr.git
    cd ia-gr
    ```
2. Instale as dependências:
    ```bash
    npm install
    ```
3. Configure as variáveis de ambiente:
    ```bash
    cp .env.example .env.local
    ```
    Edite `.env.local` e insira sua chave da OpenAI.

4. Execute o servidor de desenvolvimento:
    ```bash
    npm run dev
    ```
5. Acesse [http://localhost:3000](http://localhost:3000) no navegador.

---

## 📁 Estrutura do Projeto

```
src/
├── app/                    # App Router do Next.js
│   ├── api/               # APIs do backend
│   │   ├── upload/        # Upload e parse de XML
│   │   └── validate/      # Validação com IA
│   ├── page.js            # Página principal
│   └── globals.css        # Estilos globais
├── components/            # Componentes React
│   ├── FileUpload.jsx     # Upload de arquivos
│   ├── ManualCTeForm.jsx  # Formulário manual
│   ├── TabView.jsx        # Sistema de abas
│   └── Button.jsx         # Botão customizado
└── lib/                   # Utilitários e lógica
    ├── cte-schema.js      # Schema do CTe
    ├── input-masks.js     # Máscaras de input
    ├── openai-client.js   # Cliente OpenAI
    ├── policy-rules.js    # Regras da apólice
    └── xml-parser.js      # Parser de XML
```

---

## 🎨 Interface

### Duas Abordagens de Entrada

#### 📁 Upload XML

- Arraste e solte ou selecione arquivo XML
- Processamento automático dos dados do CTe
- Validação imediata com IA

#### 📝 Configuração Manual

- Formulário estruturado com validação em tempo real
- Auto-save no navegador
- Máscaras de input (CNPJ, telefone, valores)
- Campos aninhados para origem/destino

### Resultados Visuais

- **✅ Verde**: Conforme com a apólice
- **❌ Vermelho**: Não conforme - violações encontradas
- **⚠️ Amarelo**: Avisos e riscos identificados
- **🤖 Azul**: Processamento com IA

---

## 📋 Regras da Apólice

### Mercadorias Excluídas

- Aparelhos de telefonia celular
- Armas, munições e explosivos
- Medicamentos em geral
- Veículos e motocicletas
- E outras categorias específicas

### Limites de Garantia

- **Geral**: R$ 1.000.000,00
- **Pneus (DPaschoal)**: R$ 400.000,00
- **Transporte por moto**: R$ 10.000,00

### Emitente Autorizado

- **CNPJ**: 17.784.261/0001-42
- **Nome**: CANLOG BUSINESS & SOLUTIONS EIRELI

### Localizações

- Validação de origem e destino conforme regras da apólice

---

## 🤖 Como Funciona a IA

1. **Extração de Dados**: XML é parseado ou dados são estruturados manualmente
2. **Geração de Prompt**: Regras da apólice são convertidas em prompt para IA
3. **Análise IA**: GPT-4 analisa conformidade usando inteligência semântica
4. **Resultado**: JSON estruturado com validação, violações e riscos

---

## 🔒 Segurança

- Validação de arquivos XML
- Sanitização de dados de entrada
- Tratamento robusto de erros
- Variáveis de ambiente para chaves sensíveis

---

## 🚀 Deploy

### Vercel (Recomendado)

```bash
npm run build
vercel --prod
```

### Outras Plataformas

Compatível com Netlify, Railway, Heroku, AWS Amplify e qualquer plataforma que suporte Next.js.

---

## 🛠️ Desenvolvimento

### Estrutura de Branches

- `main`: Código em produção
- `develop`: Desenvolvimento ativo
- `feature/*`: Novas funcionalidades
- `hotfix/*`: Correções urgentes

### Padrões de Commit

- `feat:` Nova funcionalidade
- `fix:` Correção de bug
- `docs:` Documentação
- `style:` Formatação
- `refactor:` Refatoração

---

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

---

## 🙏 Agradecimentos

- OpenAI pela API GPT-4
- Next.js pela framework incrível
- Tailwind CSS pelo sistema de design
- Comunidade open source

---

**Desenvolvido com ❤️ para simplificar a