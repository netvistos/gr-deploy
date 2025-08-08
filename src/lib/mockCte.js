const mockCte = {
  emitente: {
    cnpj: '12345678000199',
    nome: 'Transportadora Exemplo Ltda',
  },
  dataTransporte: '2024-08-10T10:00:00.000Z',
  mercadoria: {
    descricao: 'Cigarro de palha',
    valor: '150000.00',
  },
  transporte: {
    origem: {
      municipio: 'São Paulo',
      uf: 'SP',
    },
    destino: {
      municipio: 'Limeira',
      uf: 'SP',
    },
  },
};

async function testValidateMock() {
  try {
    const response = await fetch('http://localhost:3000/api/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cteData: mockCte }),
    });
    const data = await response.json();
    console.log('Resultado da validação do CTe:', data.validation);
  } catch (error) {
    console.error('Erro ao validar o CTe:', error);
  }
}

testValidateMock();