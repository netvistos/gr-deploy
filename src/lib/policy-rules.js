// Regras da Apólice de Seguro para Validação de CTe
// Baseado na planilha de regras fornecida

export const POLICY_RULES = {
  emitente: {
    cnpj: "13.657.062/0001-12",
    nome: "LOGITIME TRANSPORTES LTDA",
    vigencia: "19/10/2024 até 31/10/2026",
  },

  mercadoriasExcluidas: {
    condicao1: {
      regra:
        "Qualquer mercadoria que se esteja na lista a seguir estará proibida",
      mercadorias: [
        "o veículo transportador",
        "apólices, bilhetes de loteria, cartões de crédito, cartões telefônicos e cartões de estacionamento em geral",
        "ações, cheques, contas, comprovantes de débitos, conhecimentos, ordens de pagamento, saques, e dinheiro, em moeda ou papel",
        "diamantes industriais, documentos e obrigações de qualquer espécie, e escrituras",
        "joias, pérolas em geral, pedras preciosas ou semipreciosas, metais preciosos e semipreciosos e suas ligas (trabalhadas ou não), notas e notas promissórias",
        "registros, títulos, selos e estampilhas",
        "talões de cheque, vales-alimentação, vale-refeição e similares",
        "cargas radioativas e cargas nucleares",
        "aqueles não averbados no Seguro Obrigatório de Responsabilidade Civil do Transportador Rodoviário – Carga (RCTR-C)",
        "quaisquer outros bens ou mercadorias, relacionados na apólice, mediante acordo entre partes",
        "asbestos (puro ou de produtos feitos inteiramente de amianto)",
        "tintas à base de chumbo",
        "Antiguidades",
        "Armas, Munições e Explosivos",
        "Bagagem",
        "Cerâmicas e Cristais",
        "Cigarros",
        "Farinha de peixe",
        "Ladrilhos e Louças",
        "Relógios",
        "Vacinas (de uso humano e/ou veterinário)",
        "Veículos de colecionador",
      ],
    },
    condicao2: {
      regra:
        "Se origem e destino do transporte for o Estado do Rio de Janeiro, as mercadorias a seguir estarão proibidas",
      mercadorias: [
        "Carne de qualquer tipo",
        "Medicamentos de qualquer tipo (de uso humano e/ou veterinário)",
        "Aparelhos de telefonia Celular, suas partes, peças e acessórios",
        "Produtos Eletrônicos e Eletroeletrônicos em geral, inclusive componentes, partes e peças (não incluso produtos de uso exclusivo da indústria)",
        "Computadores em Geral, Notebooks, Desktops, Tablets, Teclados, Monitores, CPU, Processadores, Memórias, Kit Multimídia e Semelhantes, Demais Periféricos e Demais Partes e Peças destes produtos",
        "Relógios",
        "Leite em Pó e UHT",
        "Queijo",
      ],
    },
    condicao3: {
      regra: "Cobertura",
    },
  },
};
