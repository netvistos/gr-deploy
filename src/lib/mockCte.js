// mockCte.js
const mockCte = {
  issuer: {
    cnpj: "13657062/000112",
    name: "Transportadora Exemplo Ltda",
  },
  transport_date: "2025-08-13", // ISO
  shipper: {
    cnpj: "12345678000199",
    name: "BOTICÁRIO",
  },
  goods: {
    name: "relogio oakley",
    value_brl: 150000.0,
  },
  origin: {
    city: "Belo Horizonte",
    uf: "MG",
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
    console.log(
      "Resultado da validação do CTe:",
      JSON.stringify(data, null, 2)
    );
  } catch (error) {
    console.error("Erro ao validar o CTe:", error);
  }
}

testValidateMock();
