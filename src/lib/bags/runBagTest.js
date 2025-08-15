import { validateWithBags } from "./validateWithBags.js";

const cteMock = {
  issuer: { cnpj: "12345678000199", name: "Transportadora Exemplo" },
  transport_date: "2025-08-10",
  shipper: { cnpj: "98765432000198", name: "Empresa X" },
  goods: { name: "taco de golfe", value_brl: 150000 },
  origin: { city: "São Paulo", uf: "SP" },
  destination: { city: "Rio de Janeiro", uf: "RJ" },
};

console.log("🔍 Rodando teste de validação com bag...\n");

const result = await validateWithBags(cteMock);

console.log("Resultado IA + bag:\n", result);
