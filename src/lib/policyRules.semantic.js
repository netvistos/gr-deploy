// src/lib/policyRules.semantic.js
// Policy estruturada para avaliação SEMÂNTICA pela IA.
// Chaves em inglês; valores textuais em PT-BR (como na apólice).

export const SEMANTIC_POLICY = {
  issuer: {
    cnpj: "13.657.062/0001-12",
    name: "LOGITIME TRANSPORTES LTDA",
    coverage: { start: "2024-10-19", end: "2026-10-31" }, // ISO
  },

  rules: [
    // ===== EXCLUSÕES (amostras convertidas) =====
    {
      id: "excl-abs-001",
      kind: "exclusion",
      title: "Proibições absolutas (lista geral)",
      criteria: {
        any: [
          {
            field: "goods.name",
            operator: "semantic_in",
            value: [
              "o veículo transportador",
              "apólices, bilhetes de loteria, cartões de crédito, cartões telefônicos e cartões de estacionamento",
              "joias, pérolas, pedras preciosas ou semipreciosas, metais preciosos",
              "Relógios",
              "Animais vivos",
              "Objetos de arte",
            ],
          },
        ],
      },
      effect: { status: "reprovado" },
    },
    {
      id: "excl-rj-002",
      kind: "exclusion",
      title: "Proibição se origem ou destino for RJ para mercadorias sensíveis",
      criteria: {
        all: [
          {
            field: "goods.name",
            operator: "semantic_in",
            value: [
              "Carne de qualquer tipo",
              "Medicamentos de qualquer tipo (de uso humano e/ou veterinário)",
              "Aparelhos de telefonia Celular, suas partes, peças e acessórios",
              "Produtos Eletrônicos e Eletroeletrônicos",
              "Computadores em Geral, Notebooks, Desktops, Tablets, Teclados, Monitores, CPU, Processadores, Memórias, Periféricos",
              "Relógios",
              "Leite em Pó e UHT",
              "Queijo",
            ],
          },
          {
            any: [
              { field: "origin.uf", operator: "equals", value: "RJ" },
              { field: "destination.uf", operator: "equals", value: "RJ" },
            ],
          },
        ],
      },
      effect: { status: "reprovado" },
    },

    // ===== GERENCIAMENTO DE RISCO (amostras) =====
    {
      id: "risk-semen-003",
      kind: "risk_rule",
      title: "Sêmen bovino acondicionado em cilindro de nitrogênio",
      criteria: {
        all: [
          {
            field: "goods.name",
            operator: "semantic_contains_all",
            value: ["sêmen bovino", "cilindro de nitrogênio"],
          },
        ],
      },
      bands: [
        {
          range_brl: {
            min: 0,
            max: 150000.0,
            inclusive_min: true,
            inclusive_max: true,
          },
          obligations: ["análise de perfil profissional"],
          effect: { status: "atenção" },
        },
        {
          range_brl: {
            min: 150000.01,
            max: 1000000.0,
            inclusive_min: true,
            inclusive_max: true,
          },
          obligations: [
            "análise de perfil profissional",
            "rastreamento / monitoramento de cargas OU escolta",
          ],
          effect: { status: "atenção" },
        },
        {
          range_brl: {
            min: 1000000.01,
            max: 3500000.0,
            inclusive_min: true,
            inclusive_max: true,
          },
          obligations: [
            "análise de perfil profissional",
            "rastreamento",
            "escolta OU isca eletrônica OU imobilizador",
          ],
          effect: { status: "atenção" },
        },
      ],
    },
    {
      id: "risk-sensiveis-001",
      kind: "risk_rule",
      title: "Mercadorias sensíveis (celular/computadores/medicamentos)",
      criteria: {
        any: [
          {
            field: "goods.name",
            operator: "semantic_in",
            value: [
              "Aparelhos de telefonia celular, suas partes, peças e seus acessórios",
              "Computadores e Periféricos (Notebook, Desktop, Teclados, Monitores, CPUs, Processadores, Memórias, Kit Multimídia e semelhantes)",
              "Medicamentos de qualquer tipo (de uso humano e/ou veterinário)",
            ],
          },
        ],
      },
      bands: [
        {
          range_brl: {
            min: 0,
            max: 200000.0,
            inclusive_min: true,
            inclusive_max: true,
          },
          obligations: ["análise de perfil profissional"],
          effect: { status: "atenção" },
        },
        {
          range_brl: {
            min: 200000.01,
            max: 1000000.0,
            inclusive_min: true,
            inclusive_max: true,
          },
          obligations: [
            "análise de perfil profissional",
            "rastreamento / monitoramento de cargas",
          ],
          effect: { status: "atenção" },
        },
        {
          range_brl: {
            min: 1000000.01,
            max: 2500000.0,
            inclusive_min: true,
            inclusive_max: true,
          },
          obligations: [
            "análise de perfil profissional",
            "rastreamento",
            "escolta armada",
          ],
          effect: { status: "atenção" },
        },
      ],
    },
  ],

  lmg: {
    default_brl: 3000000.0, // R$ 3.000.000,00
    notes: "Aplica quando nenhuma risk_rule enquadrar",
  },
};
