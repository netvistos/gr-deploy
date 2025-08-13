export const CTE_SCENARIOS = [
  {
    id: "cenario-lmg-1",
    description:
      "Peças de veículos elétricos (9000000 BRL) — bate regra BYD com teto maior que default",
    cteData: {
      issuer: { cnpj: "13657062000112", name: "LOGITIME TRANSPORTES LTDA" },
      transport_date: "2025-09-15",
      shipper: { cnpj: "99999999000199", name: "BYD MAN" },
      goods: { name: "peças de veículos elétricos", value_brl: 9000000 },
      origin: { city: "Campinas", uf: "SP" },
      destination: { city: "Curitiba", uf: "PR" },
    },
  },
  {
    id: "cenario-lmg-2",
    description:
      "Peças de veículos elétricos (12000000 BRL) — valor ultrapassa último band, mantém teto de 8mi",
    cteData: {
      issuer: { cnpj: "13657062000112", name: "LOGITIME TRANSPORTES LTDA" },
      transport_date: "2025-09-16",
      shipper: { cnpj: "99999999000199", name: "BYD MAN" },
      goods: { name: "peças de veículos elétricos", value_brl: 12000000 },
      origin: { city: "Limeira", uf: "SP" },
      destination: { city: "Sorocaba", uf: "SP" },
    },
  },
  {
    id: "cenario-lmg-3",
    description:
      "Notebooks corporativos (5000000 BRL) — não bate regra de risco, fica no default",
    cteData: {
      issuer: { cnpj: "13657062000112", name: "LOGITIME TRANSPORTES LTDA" },
      transport_date: "2025-09-17",
      shipper: { cnpj: "12312312000112", name: "DISTRIBUIDORA TECH" },
      goods: { name: "notebooks corporativos", value_brl: 5000000 },
      origin: { city: "São Paulo", uf: "SP" },
      destination: { city: "Belo Horizonte", uf: "MG" },
    },
  },
  {
    id: "cenario-lmg-4",
    description:
      "Painéis solares (9500000 BRL) + Peças EV — bate duas regras, pega o maior LMG (10mi do painel)",
    cteData: {
      issuer: { cnpj: "13657062000112", name: "LOGITIME TRANSPORTES LTDA" },
      transport_date: "2025-09-18",
      shipper: { cnpj: "99999999000199", name: "BYD MAN" },
      goods: {
        name: "painéis solares e peças de veículos elétricos",
        value_brl: 9500000,
      },
      origin: { city: "Curitiba", uf: "PR" },
      destination: { city: "São Paulo", uf: "SP" },
    },
  },
  {
    id: "cenario-lmg-5",
    description:
      "Relógios de luxo (4000000 BRL) — exclusão geral + bate regra de risco",
    cteData: {
      issuer: { cnpj: "13657062000112", name: "LOGITIME TRANSPORTES LTDA" },
      transport_date: "2025-09-19",
      shipper: { cnpj: "55555555000155", name: "IMPORTADORA XYZ" },
      goods: { name: "relógios de luxo", value_brl: 4000000 },
      origin: { city: "Campinas", uf: "SP" },
      destination: { city: "Curitiba", uf: "PR" },
    },
  },
  {
    id: "cenario-lmg-6",
    description:
      "Smartphones (2800000 BRL) — exclusão por UF RJ + bate regra de risco",
    cteData: {
      issuer: { cnpj: "13657062000112", name: "LOGITIME TRANSPORTES LTDA" },
      transport_date: "2025-09-20",
      shipper: { cnpj: "77777777000177", name: "TECH IMPORTS" },
      goods: { name: "smartphones de última geração", value_brl: 2800000 },
      origin: { city: "São Paulo", uf: "SP" },
      destination: { city: "Rio de Janeiro", uf: "RJ" },
    },
  },
];
