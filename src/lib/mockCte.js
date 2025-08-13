// mockCte.js
const mockCte = {
  issuer: {
    cnpj: "12345678000199",
    name: "Transportadora Exemplo Ltda",
  },
  transport_date: "2025-03-22", // ISO
  shipper: {
    cnpj: "98765432000198",
    name: "MANN+HUMMEL BRASIL LTDA",
  },
  goods: {
    name: "relogio oakley",
    value_brl: 150000.0,
  },
  origin: {
    city: "Rio de Janeiro",
    uf: "RJ",
  },
  destination: {
    city: "Limeira",
    uf: "SP",
  },
};

// Teste local do endpoint
async function testValidateMock() {
  try {
    const response = await fetch("http://localhost:3000/api/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cteData: mockCte, mode: "completa" }),
    });
    const data = await response.json();
    console.log("Resultado da validação do CTe:", data);
  } catch (error) {
    console.error("Erro ao validar o CTe:", error);
  }
}

testValidateMock();
