export const CTE_SCENARIOS = [
  {
    issuer: {
      cnpj: "13.657.062/0001-12", // CNPJ no formato oficial
      name: "LOGITIME TRANSPORTES LTDA",
    },
    transport_date: "2025-10-01", // formato ISO
    shipper: {
      cnpj: "98.765.432/0001-98",
      name: "MANN+HUMMEL BRASIL LTDA",
    },
    goods: {
      name: "taco de beisebol", // nome capitalizado
      value_brl: 2800000, // número direto
    },
    origin: { city: "Rio de Janeiro", uf: "RJ" },
    destination: { city: "Limeira", uf: "SP" },
  },
  {
    issuer: {
      cnpj: "13.657.062/0001-12", // CNPJ no formato oficial
      name: "bola de boliche",
    },
    transport_date: "2025-10-01", // formato ISO
    shipper: {
      cnpj: "98.765.432/0001-98",
      name: "MANN+HUMMEL BRASIL LTDA",
    },
    goods: {
      name: "chuteira de futebol", // nome capitalizado
      value_brl: 2800000, // número direto
    },
    origin: { city: "Rio de Janeiro", uf: "RJ" },
    destination: { city: "Limeira", uf: "SP" },
  },
];
