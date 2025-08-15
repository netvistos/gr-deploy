export const POLICY_RULES = {
  issuer: {
    cnpj: "13.657.062/0001-12",
    name: "LOGITIME TRANSPORTES LTDA",
    coverage: { start: "2024-10-19", end: "2026-10-31" },
  },

  // =========================
  // 1) EXCLUSÕES (proibições)
  // =========================
  exclusions: [
    {
      id: "excl-geral-001",
      title: "Bens ou mercadorias não compreendidos no seguro (lista geral)",
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
              "asbestos (puro ou de produtos feitos inteiramente de amianto)",
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

    {
      id: "excl-rj-002",
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

    {
      id: "excl-outros-003",
      title:
        "Cláusula IX – Cobertura de bens sujeitos a condições próprias (não cobertos)",
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

    {
      id: "excl-clausula-115-qbrn",
      title:
        "115 - Cláusula específica de exclusão de Armas Químicas, Biológicas, Bioquímicas, Eletromagnéticas e de Ataque Cibernético",
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
  ],

  // ==============================================
  // 2) GERENCIAMENTO DE RISCO (pontos + faixas)
  // ==============================================
  risk_rules: {
    by_goods: [
      // === RISCO A ===
      {
        id: "risk-A",
        title: "RISCO A (lista de mercadorias)",
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
                "Computadores e Periféricos (Notebook, Desktop, Teclados, Monitores, CPU’s, Processadores, Memorias, Kit Multimídia e semelhantes)",
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
              min: 0,
              max: 40000.0,
              inclusive_min: true,
              inclusive_max: true,
            },
            obligations: ["análise de perfil profissional"],
            effect: { status: "atenção" },
          },
          {
            range_brl: {
              min: 40000.01,
              max: 350000.0,
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
              min: 350000.01,
              max: 600000.0,
              inclusive_min: true,
              inclusive_max: true,
            },
            obligations: [
              "análise de perfil profissional",
              "rastreamento / monitoramento de carga",
              "acompanhamento de escolta armada e monitorada do início ao fim do risco OU Isca Eletrônica RF OU Imobilizador Inteligente",
              // Nota: mantido exatamente como OU OU conforme PDF; sem "Proibido Autônomo" nesta linha
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
              "acompanhamento de escolta armada e monitorada do início ao fim do risco OU Imobilizador Inteligente E Isca Eletrônica RF",
            ],
            effect: { status: "atenção" },
          },
        ],
      },

      // === RISCO B ===
      {
        id: "risk-B",
        title: "RISCO B (lista de mercadorias)",
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
                "Ferramentas Manuais ou elétricas (por exemplo, furadeiras, serras elétricas, lixadeiras, etc.)",
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
                "Polímeros e seus derivados (Polietileno, polipropileno, Policloreto de vinila, etc).",
                "Porcelanas e Pisos Cerâmicos",
                "Produtos alimentícios em geral",
                "Produtos farmacêuticos (exceto medicamentos)",
                "Produtos Siderúrgicos",
                "Produtos químicos em geral (inclusive de uso veterinário)",
                "Produtos óticos em geral",
                "Relógios",
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
              "rastreamento / monitoramento de cargas OU acompanhamento de escolta armada e monitorada do início ao fim do risco",
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
              "acompanhamento de escolta armada e monitorada do início ao fim do risco OU Isca Eletrônica RF OU Imobilizador Inteligente",
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
              "acompanhamento de escolta armada e monitorada do início ao fim do risco OU Isca Eletrônica RF E Imobilizador Inteligente",
            ],
            effect: { status: "atenção" },
          },
        ],
      },

      // Itens específicos por mercadoria
      {
        id: "risk-semen-bovino",
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
              "rastreamento / monitoramento de cargas OU acompanhamento de escolta armada e monitorada do início ao fim do risco",
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
              "acompanhamento de escolta armada e monitorada do início ao fim do risco OU Isca Eletrônica RF OU Imobilizador Inteligente",
            ],
            effect: { status: "atenção" },
          },
        ],
      },

      {
        id: "risk-maquinas-pesadas",
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

      {
        id: "risk-aeronaves-desmontadas",
        title:
          "aeronaves desmontadas, inclusive suas partes e peças e acessórios",
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

      // Painel Solar – cenário genérico (não BYD)
      {
        id: "risk-painel-solar",
        title: "PAINEL SOLAR (origem OU destino diferente de RJ)",
        criteria: {
          all: [
            {
              field: "goods.name",
              operator: "semantic_equals",
              value: "painel solar",
            },
            {
              any: [
                { field: "origin.uf", operator: "not_equals", value: "RJ" },
                {
                  field: "destination.uf",
                  operator: "not_equals",
                  value: "RJ",
                },
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
              "acompanhamento de escolta armada e monitorada do início ao fim do risco OU 01 Fiscal de Rota OU Imobilizador Inteligente",
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
              "acompanhamento de escolta armada e monitorada do início ao fim do risco OU 01 Fiscal de Rota OU Imobilizador Inteligente",
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
              "acompanhamento de escolta armada e monitorada do início ao fim do risco OU Imobilizador Inteligente E Lacre Eletrônico E Isca Eletrônica",
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
              "acompanhamento de escolta armada e monitorada do início ao fim do risco OU 01 Fiscal de Rota E Isca Eletrônica E Imobilizador Inteligente",
            ],
            effect: { status: "atenção" },
          },
        ],
      },
    ],

    by_shipper: [
      // MANN+HUMMEL
      {
        id: "risk-shipper-mannhummel",
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
              "rastreamento / monitoramento de cargas OU acompanhamento de escolta armada e monitorada do início ao fim do risco",
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
              "acompanhamento de escolta armada e monitorada do início ao fim do risco OU Isca Eletrônica RF OU Imobilizador Inteligente",
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
              "acompanhamento de escolta armada e monitorada do início ao fim do risco OU Isca Eletrônica RF E Imobilizador Inteligente",
            ],
            effect: { status: "atenção" },
          },
        ],
      },

      // MIBA (origem OU destino != RJ)
      {
        id: "risk-shipper-miba",
        title: "Embarcador MIBA (origem OU destino diferente de RJ)",
        criteria: {
          all: [
            {
              field: "shipper.name",
              operator: "semantic_equals",
              value: "MIBA",
            },
            {
              any: [
                { field: "origin.uf", operator: "not_equals", value: "RJ" },
                {
                  field: "destination.uf",
                  operator: "not_equals",
                  value: "RJ",
                },
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
    ],

    operations: [
      // BYD MAN – lista de mercadorias (baterias/filtros/peças EV)
      {
        id: "op-byd-man-itens-ev",
        title:
          "OPERAÇÃO BYD MAN (células de baterias, filtros, peças de veículos elétricos)",
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
              "02 Iscas Eletrônicas RF E Imobilizador Inteligente E Escolta Armada",
            ],
            effect: { status: "atenção" },
          },
        ],
      },

      // BYD MAN – PAINEL SOLAR (operação dedicada)
      {
        id: "op-byd-man-painel-solar",
        title: "OPERAÇÃO BYD MAN PAINEL SOLAR",
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
    ],
  },

  // ======================
  // 3) LMG (limites)
  // ======================
  lmg: {
    default_brl: 3000000.0,
    notes:
      "LMG final = maior valor do último range_brl.max das regras de risco aplicáveis ou default se nenhuma regra bater.",
  },
};
