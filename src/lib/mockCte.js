const mockCte = {
  issuer: {
    cnpj: "13.657.062/0001-12", // CNPJ no formato oficial
    name: "LOGITIME TRANSPORTES LTDA",
  },
  transport_date: "2021-10-01", // formato ISO
  shipper: {
    cnpj: "98.765.432/0001-98",
    name: "MANN+HUMME",
  },
  goods: {
    name: "Tablets em Geral", // nome capitalizado
    value_brl: 2_800_000, // número direto
  },
  origin: { city: "Rio de Janeiro", uf: "RJ" },
  destination: { city: "Limeira", uf: "SP" },
};

// Função de teste local contra a API /api/validate
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
