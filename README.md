# CTe Validator - Validador de Conhecimento de Transporte Eletrônico

Sistema de validação de CTe usando IA para verificar conformidade com apólices de seguro.

## 🚀 Deploy no Render

### Passo a passo:

1. **Push para GitHub:**
   ```bash
   git add .
   git commit -m "Preparação para deploy no Render"
   git push origin main
   ```

2. **Configurar no Render:**
   - Acesse [render.com](https://render.com)
   - Conecte sua conta GitHub
   - Clique em "New +" → "Web Service"
   - Selecione seu repositório
   - Configure as variáveis de ambiente:
     - `OPENAI_API_KEY`: Sua chave da OpenAI
     - `NODE_ENV`: production

3. **Deploy automático:**
   - O Render detectará automaticamente o `render.yaml`
   - Build será executado automaticamente
   - Aplicação ficará disponível na URL gerada

## 🔧 Tecnologias

- **Frontend:** Next.js 15, React 19, Tailwind CSS
- **Backend:** Next.js API Routes
- **IA:** OpenAI GPT-4o
- **Deploy:** Render.com

## 🔑 Variáveis de Ambiente

Copie `.env.example` para `.env.local` para desenvolvimento:

```bash
cp .env.example .env.local
```

Configure:
- `OPENAI_API_KEY`: Chave da API da OpenAI

## 🛠️ Desenvolvimento Local

```bash
# Instalar dependências
npm install

# Executar em modo desenvolvimento
npm run dev

# Build para produção
npm run build

# Executar build de produção
npm start
```

## 📁 Estrutura

```
src/
├── app/
│   ├── api/
│   │   ├── upload/     # Endpoint para upload de XML
│   │   └── validate/   # Endpoint para validação
│   ├── layout.js       # Layout principal
│   └── page.js         # Página inicial
├── components/         # Componentes React
├── lib/               # Utilitários e lógica de negócio
└── tests/             # Testes
```

## 🎯 Funcionalidades

- Upload de arquivos XML CTe
- Validação com IA (GPT-4o)
- Dois modos de validação:
  - **Completa:** Mostra todos os erros
  - **Sequencial:** Para no primeiro erro
- Interface moderna e responsiva
- Feedback em tempo real de custos da API
