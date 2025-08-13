export const CTE_SCENARIOS = [
  // Cenário 5 – 3 regras de risco ativas, LMG vindo da maior
  {
    id: "cenario-5",
    description:
      "Computadores + MANN+HUMMEL + peças de veículos elétricos com BYD MAN (5000000 BRL)",
    cteData: {
      issuer: { cnpj: "13.657.062/0001-12", name: "LOGITIME TRANSPORTES LTDA" },
      transport_date: "2025-09-20",
      shipper: { cnpj: "11.111.111/0001-11", name: "BYD MAN" },
      goods: {
        name: "peças de veículos elétricos e Computadores e Periféricos",
        value_brl: 5000000,
      },
      origin: { city: "São Paulo", uf: "SP" },
      destination: { city: "Curitiba", uf: "PR" },
    },
  },

  // Cenário 6 – Exclusão geral + risco
  {
    id: "cenario-6",
    description: "Relógios com embarcador BYD MAN (6000000 BRL)",
    cteData: {
      issuer: { cnpj: "13.657.062/0001-12", name: "LOGITIME TRANSPORTES LTDA" },
      transport_date: "2025-09-21",
      shipper: { cnpj: "22.222.222/0001-22", name: "BYD MAN" },
      goods: { name: "Relógios esportivos de luxo", value_brl: 6000000 },
      origin: { city: "Campinas", uf: "SP" },
      destination: { city: "Belo Horizonte", uf: "MG" },
    },
  },

  // Cenário 7 – Operação BYD painel solar, valor no teto
  {
    id: "cenario-7",
    description: "Painel solar com embarcador BYD MAN (9500000 BRL)",
    cteData: {
      issuer: { cnpj: "13.657.062/0001-12", name: "LOGITIME TRANSPORTES LTDA" },
      transport_date: "2025-09-22",
      shipper: { cnpj: "33.333.333/0001-33", name: "BYD MAN" },
      goods: { name: "painel solar", value_brl: 9500000 },
      origin: { city: "Fortaleza", uf: "CE" },
      destination: { city: "São Luís", uf: "MA" },
    },
  },

  // Cenário 8 – Sem risco, apenas default
  {
    id: "cenario-8",
    description: "Móveis residenciais (1000000 BRL)",
    cteData: {
      issuer: { cnpj: "13.657.062/0001-12", name: "LOGITIME TRANSPORTES LTDA" },
      transport_date: "2025-09-23",
      shipper: { cnpj: "44.444.444/0001-44", name: "Transportes Gerais Ltda" },
      goods: { name: "móveis residenciais", value_brl: 1000000 },
      origin: { city: "Florianópolis", uf: "SC" },
      destination: { city: "Porto Alegre", uf: "RS" },
    },
  },
];
