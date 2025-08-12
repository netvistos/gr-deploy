const mockCte = {
  emitente: {
    cnpj: "12345678000199",
    nome: "Transportadora Exemplo Ltda",
  },
  data_transporte: "22/03/2025",
  embarcador: {
    cnpj: "98765432000198",
    nome: "MANN+HUMMEL BRASIL LTDA",
  },
  mercadoria: {
    nome: "relogio oakley",
    valor: "150000.00",
  },
  origem: {
    municipio: "Rio de Janeiro",
    uf: "RJ",
  },
  destino: {
    municipio: "Limeira",
    uf: "SP",
  },
};

// Mode: sequencial || completa

async function testValidateMock() {
  try {
    const response = await fetch("http://localhost:3000/api/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cteData: mockCte,
        mode: "completa",
      }),
    });
    const data = await response.json();
    console.log("Resultado da validação do CTe:", data);
  } catch (error) {
    console.error("Erro ao validar o CTe:", error);
  }
}

testValidateMock();
