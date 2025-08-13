// src/lib/policyRules.semantic.js
// Policy SEMÂNTICA: chaves em EN para consistência de código; textos em PT-BR (fiéis à apólice).
// Valores monetários em BRL (number). Datas ISO (yyyy-mm-dd).

export const SEMANTIC_POLICY = {
  issuer: {
    cnpj: "13.657.062/0001-12",
    name: "LOGITIME TRANSPORTES LTDA",
    coverage: { start: "2024-10-19", end: "2026-10-31" },
  },

  rules: [
    // =======================
    // EXCLUSÕES (bens proibidos)
    // =======================

    // condicao_1: proibições gerais
    {
      id: "excl-geral-001",
      kind: "exclusion",
      title: "Proibições absolutas (lista geral)",
      criteria: {
        any: [
          {
            field: "goods.name",
            operator: "semantic_in",
            value: [
              "o veículo transportador",
              "apólices, bilhetes de loteria, cartões de crédito, cartões telefônicos e cartões de estacionamento em geral",
              "ações, cheques, contas, comprovantes de débitos, conhecimentos, ordens de pagamento, saques, e dinheiro, em moeda ou papel",
              "diamantes industriais, documentos e obrigações de qualquer espécie, e escrituras",
              "joias, pérolas em geral, pedras preciosas ou semipreciosas, metais preciosos e semipreciosos e suas ligas (trabalhadas ou não), notas e notas promissórias",
              "registros, títulos, selos e estampilhas",
              "talões de cheque, vales-alimentação, vale-refeição e similares",
              "cargas radioativas e cargas nucleares",
              "aqueles não averbados no Seguro Obrigatório de Responsabilidade Civil do Transportador Rodoviário – Carga (RCTR-C)",
              "quaisquer outros bens ou mercadorias, relacionados na apólice, mediante acordo entre partes",
              "asbestos",
              "tintas à base de chumbo",
              "Antiguidades",
              "Armas, Munições e Explosivos",
              "Bagagem",
              "Cerâmicas e Cristais",
              "Cigarros",
              "Farinha de peixe",
              "Ladrilhos e Louças",
              "Relógios",
              "Vacinas (de uso humano e/ou veterinário)",
              "Veículos de colecionador",
            ],
          },
        ],
      },
      effect: { status: "reprovado" },
    },

    // condicao_2: proibição geográfica RJ + lista
    {
      id: "excl-rj-002",
      kind: "exclusion",
      title: "Proibição se origem ou destino for RJ para lista específica",
      criteria: {
        all: [
          {
            field: "goods.name",
            operator: "semantic_in",
            value: [
              "Carne de qualquer tipo",
              "Medicamentos de qualquer tipo (de uso humano e/ou veterinário)",
              "Aparelhos de telefonia Celular, suas partes, peças e acessórios",
              "Produtos Eletrônicos e Eletroeletrônicos em geral, inclusive componentes, partes e peças (não incluso produtos de uso exclusivo da indústria)",
              "Computadores em Geral, Notebooks, Desktops, Tablets, Teclados, Monitores, CPU, Processadores, Memórias, Kit Multimídia e Semelhantes, Demais Periféricos e Demais Partes e Peças destes produtos",
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

    // condicao_3: outras proibições
    {
      id: "excl-outros-003",
      kind: "exclusion",
      title: "Proibições adicionais",
      criteria: {
        any: [
          {
            field: "goods.name",
            operator: "semantic_in",
            value: [
              "Mudanças de móveis e utensílios (residenciais ou de escritório)",
              "Animais vivos",
              "Objetos de arte (quadros, esculturas, antiguidades e coleções)",
            ],
          },
        ],
      },
      effect: { status: "reprovado" },
    },

    // cláusula específica: armas químicas etc.
    {
      id: "excl-clausula-arma-quimica",
      kind: "exclusion",
      title: "Cláusula específica de exclusão de armas (QBRN e correlatas)",
      criteria: {
        any: [
          {
            field: "goods.name",
            operator: "semantic_in",
            value: [
              "Armas Químicas, Biológicas, Bioquímicas, Eletromagnéticas e de Ataque Cibernético",
            ],
          },
        ],
      },
      effect: { status: "reprovado" },
    },

    // =======================
    // GERENCIAMENTO DE RISCO (pontos de atenção + faixas)
    // =======================

    // condicao_1: lista de itens sensíveis (celular/café/carne/cobre/combustíveis/PCs/defensivos/etc.)
    {
      id: "risk-001",
      kind: "risk_rule",
      title: "Ponto de atenção: mercadorias sensíveis (lista 1)",
      criteria: {
        any: [
          {
            field: "goods.name",
            operator: "semantic_in",
            value: [
              "Aparelhos de telefonia celular, suas partes, peças e seus acessórios",
              "Café de qualquer tipo",
              "Carne congelada, in natura e charque",
              "Cobre (qualquer tipo)",
              "Combustíveis e seus derivados",
              "Computadores e Periféricos (Notebook, Desktop, Teclados, Monitores, CPUs, Processadores, Memorias, Kit Multimídia e semelhantes)",
              "Defensivos Agrícolas",
              "Estanho (qualquer tipo)",
              "Ferro Vanádio (qualquer tipo)",
              "Medicamentos de qualquer tipo (de uso humano e/ou veterinário)",
              "Minério de molibdênio (qualquer tipo)",
              "Nióbio de ferro (qualquer tipo)",
              "Tablets em Geral",
            ],
          },
        ],
      },
      bands: [
        {
          range_brl: {
            min: 40000.0,
            max: 350000.0,
            inclusive_min: true,
            inclusive_max: true,
          },
          obligations: [
            "análise de perfil profissional",
            "rastreamento / monitoramento de cargas (a partir de 40k)",
          ],
          effect: { status: "atenção" },
        },
        {
          range_brl: {
            min: 350000.01,
            max: 600000.0,
            inclusive_min: true,
            inclusive_max: true,
          },
          obligations: [
            "análise de perfil profissional",
            "rastreamento / monitoramento de carga",
            "acompanhamento de escolta armada e monitorada do início ao fim do risco",
            "Isca Eletrônica RF",
            "Imobilizador Inteligente",
            "Proibido Autônomo",
          ],
          effect: { status: "atenção" },
        },
        {
          range_brl: {
            min: 600000.01,
            max: 1000000.0,
            inclusive_min: true,
            inclusive_max: true,
          },
          obligations: [
            "análise de perfil profissional",
            "rastreamento / monitoramento de carga",
            "acompanhamento de escolta armada e monitorada do início ao fim do risco",
            "Imobilizador Inteligente",
            "Isca Eletrônica RF",
          ],
          effect: { status: "atenção" },
        },
      ],
    },

    // condicao_2: lista 2 extensa + faixas + “MOTORISTA FROTA” >= 2.000.000
    {
      id: "risk-002",
      kind: "risk_rule",
      title: "Ponto de atenção: mercadorias sensíveis (lista 2)",
      criteria: {
        any: [
          {
            field: "goods.name",
            operator: "semantic_in",
            value: [
              "Aço e Ferro em geral",
              "Álcool Etílico e para fins medicinais/farmacêuticos",
              "Algodão de qualquer tipo",
              "Alumínio em geral (perfis, tubos, chapas, bobinas, folhas, lingotes, tarugos, vergalhões, etc.)",
              "Açúcar, Arroz e Trigo",
              "Aparelhos Eletroeletrônicos de Som e Imagem",
              "Artigos de higiene e limpeza",
              "Artigos escolares e de papelaria",
              "Artigos esportivos",
              "Artigos, filmes e máquinas fotográficas",
              "Autopeças inclusive para motocicleta",
              "Bacalhau",
              "Balas, chocolates, chiclete e doces em geral",
              "Baterias automotivas",
              "Bebidas em geral",
              "Brinquedos e Bicicletas (partes, peças e acessórios)",
              "Cabos de Fibra Óptica",
              "Calçados em geral (tênis, sapatos, chinelos, sandálias), solados, palmilhas e correias",
              "Capas e películas para aparelho celular",
              "Cartuchos para impressoras e copiadoras",
              "Cassiterita (qualquer tipo)",
              "CD (Compact Disc)/ LD (Laser Disc) / DVD / Blu-ray",
              "Confecções, fios de seda, fios têxteis e tecidos",
              "Cosméticos/ Perfumes",
              "Couro Cru, Wetblue (semi-acabado) ou beneficiado",
              "Eletrodomésticos",
              "Empilhadeiras",
              "Equipamento Médico Hospitalar",
              "Fechaduras e Ferragens em geral",
              "Ferramentas Manuais ou elétricas",
              "Fertilizantes",
              "Fios ou cabos elétricos e de telefonia",
              "Fraldas descartáveis",
              "Granitos e Mármores",
              "Impressoras em geral",
              "Lâmpadas (reatores, luminárias e periféricos)",
              "Latão e Folhas de Flandres",
              "Leite em pó ou condensado",
              "Livros e revistas em geral",
              "Materiais elétricos, interruptores, fusíveis e semelhantes",
              "Níquel (qualquer tipo)",
              "Óleos comestíveis e óleos lubrificantes",
              "Pneus e câmaras de ar",
              "Papel de qualquer tipo, resmas e celulose",
              "Pilhas e baterias",
              "Polímeros e seus derivados",
              "Porcelanas e Pisos Cerâmicos",
              "Produtos alimentícios em geral",
              "Produtos farmacêuticos (exceto medicamentos)",
              "Produtos Siderúrgicos",
              "Produtos químicos em geral (inclusive de uso veterinário)",
              "Produtos óticos em geral",
              "Relógios (Valor por Unidade inferior a R$ 2.000,00)",
              "Rolamentos em geral",
              "Sêmen bovino, acondicionado em cilindro de nitrogênio",
              "TDI (Tolueno de Isocianato), dióxido de titânio, tolueno refinado, silício metálico",
              "Tintas, Vernizes, Corantes, Pigmentos e Similares",
              "Tratores, máquinas e implementos agrícolas",
              "Tubos e conexões de PVC e Resinas de PVC",
              "Veículos transportados em veículo cegonheira/container",
              "Vidros em geral",
              "Vitaminas e suplementos alimentares",
              "Zinco (qualquer tipo)",
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
            "rastreamento / monitoramento de cargas OU acompanhamento de escolta armada e monitorada",
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
            "rastreamento / monitoramento de cargas",
            "acompanhamento de escolta armada e monitorada",
          ],
          effect: { status: "atenção" },
        },
        {
          range_brl: {
            min: 2500000.01,
            max: 3000000.0,
            inclusive_min: true,
            inclusive_max: true,
          },
          obligations: [
            "análise de perfil profissional",
            "rastreamento / monitoramento de cargas",
            "acompanhamento de escolta armada e monitorada OU Isca Eletrônica RF e Imobilizador Inteligente",
          ],
          effect: { status: "atenção" },
        },
        {
          // regra_5: "de R$ 2.000.000,00" MOTORISTA FROTA — tratar como obrigação adicional quando >=2M
          range_brl: {
            min: 2000000.0,
            max: 9999999999.0,
            inclusive_min: true,
            inclusive_max: true,
          },
          obligations: ["MOTORISTA FROTA"],
          effect: { status: "atenção" },
        },
      ],
    },

    // condicao_3: sêmen bovino + embalagem (mesmo campo – contains_all)
    {
      id: "risk-003",
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
            "rastreamento / monitoramento de cargas OU acompanhamento de escolta armada e monitorada",
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
            "rastreamento / monitoramento de cargas",
            "acompanhamento de escolta armada e monitorada OU Isca Eletrônica RF OU Imobilizador Inteligente",
          ],
          effect: { status: "atenção" },
        },
      ],
    },

    // condicao_4: máquinas/equipamentos pesados novos
    {
      id: "risk-004",
      kind: "risk_rule",
      title: "Máquinas e equipamentos pesados novos e sem uso",
      criteria: {
        any: [
          {
            field: "goods.name",
            operator: "semantic_equals",
            value: "Máquinas e equipamentos pesados novos e sem uso",
          },
        ],
      },
      bands: [
        {
          range_brl: {
            min: 0,
            max: 4000000.0,
            inclusive_min: true,
            inclusive_max: true,
          },
          obligations: ["análise de perfil profissional"],
          effect: { status: "atenção" },
        },
      ],
    },

    // condicao_5: embarcador MANN+HUMMEL (faixas)
    {
      id: "risk-005",
      kind: "risk_rule",
      title: "Embarcador MANN+HUMMEL BRASIL LTDA",
      criteria: {
        any: [
          {
            field: "shipper.name",
            operator: "semantic_equals",
            value: "MANN+HUMMEL BRASIL LTDA",
          },
        ],
      },
      bands: [
        {
          range_brl: {
            min: 0,
            max: 300000.0,
            inclusive_min: true,
            inclusive_max: true,
          },
          obligations: ["análise de perfil profissional"],
          effect: { status: "atenção" },
        },
        {
          range_brl: {
            min: 300000.01,
            max: 1000000.0,
            inclusive_min: true,
            inclusive_max: true,
          },
          obligations: [
            "análise de perfil profissional",
            "rastreamento / monitoramento de cargas OU acompanhamento de escolta armada e monitorada",
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
            "rastreamento / monitoramento de cargas",
            "acompanhamento de escolta armada e monitorada OU Isca Eletrônica RF OU Imobilizador Inteligente",
          ],
          effect: { status: "atenção" },
        },
        {
          range_brl: {
            min: 2500000.01,
            max: 3000000.0,
            inclusive_min: true,
            inclusive_max: true,
          },
          obligations: [
            "análise de perfil profissional",
            "rastreamento / monitoramento de cargas",
            "acompanhamento de escolta armada e monitorada OU Isca Eletrônica RF E Imobilizador Inteligente",
          ],
          effect: { status: "atenção" },
        },
        {
          range_brl: {
            min: 2000000.0,
            max: 9999999999.0,
            inclusive_min: true,
            inclusive_max: true,
          },
          obligations: ["MOTORISTA FROTA"],
          effect: { status: "atenção" },
        },
      ],
    },

    // condicao_6: painel solar + proibição RJ + faixas
    {
      id: "risk-006",
      kind: "risk_rule",
      title: "Painel solar (proibido para origem ou destino RJ) + faixas",
      criteria: {
        all: [
          {
            field: "goods.name",
            operator: "semantic_equals",
            value: "painel solar",
          },
          {
            none: [
              // “proibido RJ”: se for RJ, outra regra de exclusão pode reprovar; aqui só anotamos a restrição para o motor semântico
              { field: "origin.uf", operator: "equals", value: "RJ" },
              { field: "destination.uf", operator: "equals", value: "RJ" },
            ],
          },
        ],
      },
      bands: [
        {
          range_brl: {
            min: 0,
            max: 80000.0,
            inclusive_min: true,
            inclusive_max: true,
          },
          obligations: ["análise de perfil profissional"],
          effect: { status: "atenção" },
        },
        {
          range_brl: {
            min: 80000.01,
            max: 500000.0,
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
            min: 500000.01,
            max: 800000.0,
            inclusive_min: true,
            inclusive_max: true,
          },
          obligations: [
            "análise de perfil profissional",
            "rastreamento / monitoramento de cargas",
            "acompanhamento de escolta armada e monitorada OU 01 Fiscal de Rota OU Imobilizador Inteligente",
          ],
          effect: { status: "atenção" },
        },
        {
          range_brl: {
            min: 800000.01,
            max: 1200000.0,
            inclusive_min: true,
            inclusive_max: true,
          },
          obligations: [
            "análise de perfil profissional",
            "rastreamento / monitoramento de cargas",
            "acompanhamento de escolta armada e monitorada OU 01 Fiscal de Rota OU Imobilizador Inteligente",
          ],
          effect: { status: "atenção" },
        },
        {
          range_brl: {
            min: 1200000.01,
            max: 1500000.0,
            inclusive_min: true,
            inclusive_max: true,
          },
          obligations: [
            "análise de perfil profissional",
            "rastreamento / monitoramento de cargas",
            "acompanhamento de escolta armada e monitorada OU Imobilizador Inteligente E Lacre Eletrônico E Isca Eletrônica",
          ],
          effect: { status: "atenção" },
        },
        {
          range_brl: {
            min: 1500000.01,
            max: 3000000.0,
            inclusive_min: true,
            inclusive_max: true,
          },
          obligations: [
            "análise de perfil profissional",
            "rastreamento / monitoramento de cargas",
            "acompanhamento de escolta armada e monitorada OU 01 Fiscal de Rota E Isca Eletrônica E Imobilizador Inteligente",
          ],
          effect: { status: "atenção" },
        },
      ],
    },

    // condicao_7: BYD MAN + lista mercadorias + faixas
    {
      id: "risk-007",
      kind: "risk_rule",
      title:
        "BYD MAN — células de bateria / filtros / peças de veículos elétricos",
      criteria: {
        all: [
          {
            field: "shipper.name",
            operator: "semantic_equals",
            value: "BYD MAN",
          },
          {
            field: "goods.name",
            operator: "semantic_in",
            value: [
              "Células de baterias e partes e peças para uso em Ônibus elétrico",
              "filtro de ar para veículos e partes",
              "peças de veículos elétricos",
            ],
          },
        ],
      },
      bands: [
        {
          range_brl: {
            min: 0,
            max: 500000.0,
            inclusive_min: true,
            inclusive_max: true,
          },
          obligations: ["análise de perfil profissional"],
          effect: { status: "atenção" },
        },
        {
          range_brl: {
            min: 500000.01,
            max: 1500000.0,
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
            min: 1500000.01,
            max: 2500000.0,
            inclusive_min: true,
            inclusive_max: true,
          },
          obligations: [
            "análise de perfil profissional",
            "rastreamento / monitoramento de cargas",
            "Isca Eletrônica RF OU Imobilizador Inteligente OU Escolta Ostensiva OU 01 Fiscal de Rota em percurso integral",
          ],
          effect: { status: "atenção" },
        },
        {
          range_brl: {
            min: 2500000.01,
            max: 5000000.0,
            inclusive_min: true,
            inclusive_max: true,
          },
          obligations: [
            "análise de perfil profissional",
            "rastreamento / monitoramento de cargas",
            "Isca Eletrônica RF E Imobilizador Inteligente OU Escolta Ostensiva OU 01 Fiscal de Rota em percurso integral OU 02 Iscas Eletrônicas",
          ],
          effect: { status: "atenção" },
        },
        {
          range_brl: {
            min: 5000000.01,
            max: 8000000.0,
            inclusive_min: true,
            inclusive_max: true,
          },
          obligations: [
            "análise de perfil profissional",
            "rastreamento / monitoramento de cargas",
            "02 Iscas Eletrônicas RF",
            "Imobilizador Inteligente",
            "Escolta Armada",
          ],
          effect: { status: "atenção" },
        },
      ],
    },

    // condicao_8: BYD MAN + painel solar + faixas
    {
      id: "risk-008",
      kind: "risk_rule",
      title: "BYD MAN — painel solar (faixas específicas)",
      criteria: {
        all: [
          {
            field: "shipper.name",
            operator: "semantic_equals",
            value: "BYD MAN",
          },
          {
            field: "goods.name",
            operator: "semantic_equals",
            value: "painel solar",
          },
        ],
      },
      bands: [
        {
          range_brl: {
            min: 0,
            max: 80000.0,
            inclusive_min: true,
            inclusive_max: true,
          },
          obligations: ["análise de perfil profissional"],
          effect: { status: "atenção" },
        },
        {
          range_brl: {
            min: 80000.01,
            max: 500000.0,
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
            min: 500000.01,
            max: 1000000.0,
            inclusive_min: true,
            inclusive_max: true,
          },
          obligations: [
            "análise de perfil profissional",
            "rastreamento / monitoramento de cargas",
            "Isca Eletrônica RF OU Imobilizador Inteligente OU Escolta Ostensiva OU 01 Fiscal de Rota em percurso integral",
          ],
          effect: { status: "atenção" },
        },
        {
          range_brl: {
            min: 1000000.01,
            max: 1500000.0,
            inclusive_min: true,
            inclusive_max: true,
          },
          obligations: [
            "análise de perfil profissional",
            "rastreamento / monitoramento de cargas",
            "Isca Eletrônica E Escolta Armada OU Imobilizador Inteligente E Lacre Eletrônico",
          ],
          effect: { status: "atenção" },
        },
        {
          range_brl: {
            min: 1500000.01,
            max: 3000000.0,
            inclusive_min: true,
            inclusive_max: true,
          },
          obligations: [
            "análise de perfil profissional",
            "rastreamento / monitoramento de cargas",
            "Escolta Armada OU Fiscal de Rota E Isca Eletrônica E Imobilizador Inteligente OU 01 Fiscal de Rota",
          ],
          effect: { status: "atenção" },
        },
        {
          range_brl: {
            min: 3000000.01,
            max: 5000000.0,
            inclusive_min: true,
            inclusive_max: true,
          },
          obligations: [
            "02 Escoltas Armadas",
            "02 Iscas Eletrônicas",
            "Imobilizador Inteligente",
            "01 Fiscal de Rota",
          ],
          effect: { status: "atenção" },
        },
        {
          range_brl: {
            min: 5000000.01,
            max: 7000000.0,
            inclusive_min: true,
            inclusive_max: true,
          },
          obligations: [
            "02 Escoltas Armadas",
            "02 Iscas Eletrônicas",
            "Imobilizador Inteligente",
            "01 Fiscal de Rota",
          ],
          effect: { status: "atenção" },
        },
        {
          range_brl: {
            min: 7000000.01,
            max: 10000000.0,
            inclusive_min: true,
            inclusive_max: true,
          },
          obligations: [
            "03 Escoltas Armadas",
            "02 Iscas Eletrônicas",
            "Imobilizador Inteligente",
            "01 Fiscal de Rota",
          ],
          effect: { status: "atenção" },
        },
      ],
    },

    // condicao_9: MIBA com origem/destino ≠ RJ
    {
      id: "risk-009",
      kind: "risk_rule",
      title: "Embarcador MIBA (origem/destino diferente do RJ)",
      criteria: {
        all: [
          { field: "shipper.name", operator: "semantic_equals", value: "MIBA" },
          {
            all: [
              { field: "origin.uf", operator: "not_in", value: ["RJ"] },
              { field: "destination.uf", operator: "not_in", value: ["RJ"] },
            ],
          },
        ],
      },
      bands: [
        {
          range_brl: {
            min: 0,
            max: 300000.0,
            inclusive_min: true,
            inclusive_max: true,
          },
          obligations: ["análise de perfil profissional"],
          effect: { status: "atenção" },
        },
        {
          range_brl: {
            min: 300000.01,
            max: 800000.0,
            inclusive_min: true,
            inclusive_max: true,
          },
          obligations: [
            "análise de perfil profissional",
            "rastreamento / monitoramento de cargas",
          ],
          effect: { status: "atenção" },
        },
      ],
    },

    // condicao_10: aeronaves desmontadas
    {
      id: "risk-010",
      kind: "risk_rule",
      title: "Aeronaves desmontadas (partes, peças e acessórios)",
      criteria: {
        any: [
          {
            field: "goods.name",
            operator: "semantic_equals",
            value:
              "aeronaves desmontadas, inclusive suas partes e peças e acessórios",
          },
        ],
      },
      bands: [
        {
          range_brl: {
            min: 0,
            max: 300000.0,
            inclusive_min: true,
            inclusive_max: true,
          },
          obligations: ["análise de perfil profissional"],
          effect: { status: "atenção" },
        },
        {
          range_brl: {
            min: 300000.01,
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
            max: 2000000.0,
            inclusive_min: true,
            inclusive_max: true,
          },
          obligations: [
            "análise de perfil profissional",
            "rastreamento / monitoramento de cargas",
            "Trava de quinta roda OU Sensor de Desengate",
          ],
          effect: { status: "atenção" },
        },
      ],
    },
  ],

  // LMG padrão
  lmg: {
    default_brl: 3000000.0,
    notes: "Aplica quando nenhuma risk_rule enquadrar",
  },
};
