/**
 * Lista de cenários de teste para validação COMPLETA do CTe
 * Cenários criados para cobrir múltiplas variações semânticas e numéricas
 */

export const CTE_SCENARIOS = [
  // 1) Aprovação total
  {
    id: "aprovado-total",
    description: "Tudo conforme apólice (sem exclusões ou risco)",
    cte: {
      issuer: { cnpj: "13.657.062/0001-12", name: "LOGITIME TRANSPORTES LTDA" },
      transport_date: "2025-05-12",
      shipper: {
        cnpj: "55.987.321/0001-44",
        name: "COOPERATIVA AGRÍCOLA VALE VERDE",
      },
      goods: {
        name: "café arábica premium torrado e embalado a vácuo",
        value_brl: 28000,
      },
      origin: { city: "Limeira", uf: "SP" },
      destination: { city: "São Paulo", uf: "SP" },
    },
  },

  // 2) CNPJ reprovado
  {
    id: "cnpj-reprovado",
    description: "Emitente com CNPJ inválido para a apólice",
    cte: {
      issuer: { cnpj: "99.999.999/9999-99", name: "TRANS GLOBAL LOGISTICS" },
      transport_date: "2025-04-20",
      shipper: { cnpj: "78.456.123/0001-90", name: "EXPORTADORA OCEÂNICA" },
      goods: {
        name: "máquinas industriais para corte de madeira",
        value_brl: 450000,
      },
      origin: { city: "Joinville", uf: "SC" },
      destination: { city: "Manaus", uf: "AM" },
    },
  },

  // 3) Data fora de vigência
  {
    id: "data-fora-vigencia",
    description: "Data do transporte antes do início da apólice",
    cte: {
      issuer: { cnpj: "13.657.062/0001-12", name: "LOGITIME TRANSPORTES LTDA" },
      transport_date: "2024-05-01",
      shipper: {
        cnpj: "45.987.654/0001-33",
        name: "CIA BRASILEIRA DE MINERAÇÃO",
      },
      goods: { name: "granito em blocos brutos", value_brl: 175000 },
      origin: { city: "Vitória", uf: "ES" },
      destination: { city: "Curitiba", uf: "PR" },
    },
  },

  // 4) Exclusão direta
  {
    id: "exclusao-relogios",
    description: "Mercadoria proibida (Relógios)",
    cte: {
      issuer: { cnpj: "13.657.062/0001-12", name: "LOGITIME TRANSPORTES LTDA" },
      transport_date: "2025-06-10",
      shipper: { cnpj: "66.111.222/0001-55", name: "IMPORTADORA SUIÇA LTDA" },
      goods: {
        name: "relógios de pulso Rolex com caixa original",
        value_brl: 150000,
      },
      origin: { city: "Rio de Janeiro", uf: "RJ" },
      destination: { city: "Porto Alegre", uf: "RS" },
    },
  },

  // 5) Risco com atenção
  {
    id: "risco-atencao",
    description: "Mercadoria em faixa de risco baixa com obrigações mínimas",
    cte: {
      issuer: { cnpj: "13.657.062/0001-12", name: "LOGITIME TRANSPORTES LTDA" },
      transport_date: "2025-07-02",
      shipper: {
        cnpj: "11.222.333/0001-66",
        name: "ALFA COMÉRCIO INTERNACIONAL",
      },
      goods: {
        name: "bebidas alcoólicas (vinho tinto importado)",
        value_brl: 42000,
      },
      origin: { city: "Porto Alegre", uf: "RS" },
      destination: { city: "Florianópolis", uf: "SC" },
    },
  },

  // 6) Risco altera LMG
  {
    id: "risco-altera-lmg",
    description: "Regra de risco com teto maior que o default da apólice",
    cte: {
      issuer: { cnpj: "13.657.062/0001-12", name: "LOGITIME TRANSPORTES LTDA" },
      transport_date: "2025-08-05",
      shipper: { cnpj: "88.999.111/0001-77", name: "BYD MANUFACTURING BRASIL" },
      goods: {
        name: "baterias de íon-lítio para veículos elétricos",
        value_brl: 7800000,
      },
      origin: { city: "Shenzhen", uf: "EX" },
      destination: { city: "Campinas", uf: "SP" },
    },
  },

  // 7) Dois riscos aplicados
  {
    id: "dois-riscos",
    description: "Mercadoria e embarcador disparam regras de risco distintas",
    cte: {
      issuer: { cnpj: "13.657.062/0001-12", name: "LOGITIME TRANSPORTES LTDA" },
      transport_date: "2025-09-14",
      shipper: { cnpj: "55.666.777/0001-88", name: "EXPORTADORA AMAZÔNIA" },
      goods: {
        name: "bens eletrônicos diversos (smartphones, tablets)",
        value_brl: 2600000,
      },
      origin: { city: "Manaus", uf: "AM" },
      destination: { city: "São Paulo", uf: "SP" },
    },
  },

  // 8) Exclusão mas calcula LMG
  {
    id: "exclusao-mas-calcula-lmg",
    description: "Mercadoria proibida, mas cálculo de LMG executado",
    cte: {
      issuer: { cnpj: "13.657.062/0001-12", name: "LOGITIME TRANSPORTES LTDA" },
      transport_date: "2025-10-01",
      shipper: { cnpj: "33.444.555/0001-99", name: "IMPORTADORA LUXO PREMIUM" },
      goods: {
        name: "relógios inteligentes Apple Watch série 9",
        value_brl: 8500000,
      },
      origin: { city: "Rio de Janeiro", uf: "RJ" },
      destination: { city: "Brasília", uf: "DF" },
    },
  },
];
