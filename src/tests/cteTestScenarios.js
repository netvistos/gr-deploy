export const CTE_SCENARIOS = [
  // 1) Cenário aprovado - nenhuma exclusão e sem regras de risco aplicáveis
  {
    name: "Aprovado sem exclusões e sem risco",
    cteData: {
      issuer: { cnpj: "13657062000112", name: "LOGITIME TRANSPORTES LTDA" },
      transport_date: "2025-07-15",
      shipper: { cnpj: "11111111000111", name: "Cliente Neutro S/A" },
      goods: { name: "papel sulfite", value_brl: 100000.0 },
      origin: { city: "São Paulo", uf: "SP" },
      destination: { city: "Campinas", uf: "SP" },
    },
    expected: {
      BENS_EXCLUIDOS: {
        status: "aprovado",
        matched_rule_ids: [],
        violations: [],
      },
      GERENCIAMENTO_RISCO: {
        status: "aprovado",
        matched_rule_ids: [],
        obligations: [],
        bands_applied: [],
      },
    },
  },

  // 2) Reprovado por exclusão - mercadoria proibida
  {
    name: "Reprovado por mercadoria excluída (artigos esportivos)",
    cteData: {
      issuer: { cnpj: "13657062000112", name: "LOGITIME TRANSPORTES LTDA" },
      transport_date: "2025-07-15",
      shipper: { cnpj: "22222222000122", name: "Sports BR LTDA" },
      goods: { name: "taco de beisebol profissional", value_brl: 50000.0 },
      origin: { city: "Rio de Janeiro", uf: "RJ" },
      destination: { city: "São Paulo", uf: "SP" },
    },
    expected: {
      BENS_EXCLUIDOS: {
        status: "reprovado",
        matched_rule_ids: ["excl-esportivos"],
        violations: [
          "Mercadoria 'taco de beisebol' enquadra-se como artigo esportivo.",
        ],
      },
      GERENCIAMENTO_RISCO: {
        status: "aprovado",
        matched_rule_ids: [],
        obligations: [],
        bands_applied: [],
      },
    },
  },

  // 3) Atenção por regra de risco - por mercadoria
  {
    name: "Atenção por regra de risco (mercadoria de alto valor)",
    cteData: {
      issuer: { cnpj: "13657062000112", name: "LOGITIME TRANSPORTES LTDA" },
      transport_date: "2025-07-15",
      shipper: { cnpj: "33333333000133", name: "Tech Parts Brasil" },
      goods: {
        name: "placas de circuito eletrônico industrial",
        value_brl: 1500000.0,
      },
      origin: { city: "Curitiba", uf: "PR" },
      destination: { city: "Recife", uf: "PE" },
    },
    expected: {
      BENS_EXCLUIDOS: {
        status: "aprovado",
        matched_rule_ids: [],
        violations: [],
      },
      GERENCIAMENTO_RISCO: {
        status: "atenção",
        matched_rule_ids: ["risk-eletronicos"],
        obligations: ["rastreamento / monitoramento de cargas"],
        bands_applied: [{ rule_id: "risk-eletronicos", band_index: 2 }],
      },
    },
  },

  // 4) Atenção por regra de risco - embarcador específico
  {
    name: "Atenção por regra de risco (embarcardor MANN+HUMMEL)",
    cteData: {
      issuer: { cnpj: "13657062000112", name: "LOGITIME TRANSPORTES LTDA" },
      transport_date: "2025-07-15",
      shipper: { cnpj: "98765432000198", name: "MANN+HUMMEL BRASIL LTDA" },
      goods: { name: "filtros automotivos", value_brl: 2000000.0 },
      origin: { city: "Joinville", uf: "SC" },
      destination: { city: "Limeira", uf: "SP" },
    },
    expected: {
      BENS_EXCLUIDOS: {
        status: "aprovado",
        matched_rule_ids: [],
        violations: [],
      },
      GERENCIAMENTO_RISCO: {
        status: "atenção",
        matched_rule_ids: ["risk-shipper-mannhummel"],
        obligations: [
          "análise de perfil profissional",
          "rastreamento / monitoramento de cargas",
        ],
        bands_applied: [{ rule_id: "risk-shipper-mannhummel", band_index: 3 }],
      },
    },
  },

  // 5) Reprovado por exclusão + Atenção por risco
  {
    name: "Reprovado e atenção (mercadoria proibida + risco alto valor)",
    cteData: {
      issuer: { cnpj: "13657062000112", name: "LOGITIME TRANSPORTES LTDA" },
      transport_date: "2025-07-15",
      shipper: { cnpj: "44444444000144", name: "Relógios Importados ME" },
      goods: { name: "relógio de luxo", value_brl: 5000000.0 },
      origin: { city: "São Paulo", uf: "SP" },
      destination: { city: "Fortaleza", uf: "CE" },
    },
    expected: {
      BENS_EXCLUIDOS: {
        status: "reprovado",
        matched_rule_ids: ["excl-relogios"],
        violations: [
          "Mercadoria 'relógio de luxo' enquadra-se como relógio (exclusão geral).",
        ],
      },
      GERENCIAMENTO_RISCO: {
        status: "atenção",
        matched_rule_ids: ["risk-alto-valor"],
        obligations: [
          "rastreamento / monitoramento de cargas",
          "escolta armada",
        ],
        bands_applied: [{ rule_id: "risk-alto-valor", band_index: 4 }],
      },
    },
  },
];
