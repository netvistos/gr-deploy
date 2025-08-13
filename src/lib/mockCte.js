// mockCte.js
const mockCte = {
  issuer: { cnpj: "13657062000112", name: "LOGITIME TRANSPORTES LTDA" },
  transport_date: "2025-10-01",
  shipper: { cnpj: "98765432000198", name: "MANN+HUMMEL BRASIL LTDA" },
  goods: {
    name: "relógios inteligentes Apple Watch série 9",
    value_brl: 2800000,
  },
  origin: { city: "Rio de Janeiro", uf: "RJ" },
  destination: { city: "Limeira", uf: "SP" },
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
