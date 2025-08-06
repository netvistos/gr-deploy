// Regras da Apólice de Seguro para Validação de CTe
// Baseado na planilha de regras fornecida

export const POLICY_RULES = {
  // Mercadorias de Risco A (lista de texto) - Grupo A com sublimite de R$ 60.000,00
  riscoA: [
    'Produtos Eletrônicos e Eletroeletrônicos em geral, inclusive componentes, partes e peças (não incluso produtos de uso exclusivo da indústria)',
    'Computadores em Geral, Notebooks, Desktops, Tablets, Teclados, Monitores, CPU, Processadores, Memórias, Kit Multimídia e Semelhantes, Demais Periféricos e Demais Partes e Peças destes produtos',
    'Bebidas em geral',
    'Relógios (com custo individual até R$ 2.000)',
  ],

  // Mercadorias de Risco B (lista de texto) - Grupo B com sublimite de R$ 80.000,00
  riscoB: [
    'Eletrodomésticos',
    'Cosméticos, Perfumes, Artigos de Perfumaria',
    'Leite em pó, Leite condensado, Leite longa vida',
    'Óleos lubrificantes',
    'Polímeros em geral (Polietileno, Polipropileno, Poliestireno, Policloreto, Poliuretano, Estireno, Policloreto e similares) e Resinas de PVC',
    'Demais produtos alimentícios não constante nesta relação, inclusive embutidos',
    'Óleos comestíveis',
    'Sementes',
    'Fertilizantes',
    'Produtos ópticos em geral',
    'Aço e Ferro em geral (perfis, tubos, chapas, bobinas, folhas, lingotes, tarugos, vergalhões, etc.)',
    'Alumínio em geral, inclusive fios e cabos (Exceto os demais produtos acabados)',
    'Artigos, filmes e máquinas fotográficas',
    'Balas, chicletes, chocolates e doces em geral',
    'Cabos de Fibra Óptica',
    'Calçados em Geral (tênis, sapatos, chinelos, sandálias, solados, palmilhas, correias, entre outros)',
    'Cartuchos para impressoras e copiadoras',
    'CD (Compact Disc), LD (Laser Disc) e DVD (Digital Versatile Disc)',
    'Confecções, Tecidos, Fios de seda e Fios têxteis',
    'Couro Cru, Wetblue (semi acabado) ou beneficiado',
    'Fios ou cabos elétricos e de telefonia',
    'Pilhas e baterias em geral (inclusive automotiva)',
    'Tintas, Vernizes, Corantes, Pigmentos e Similares',
    'Tolueno refinado, silício metálico',
    'Produtos de higiene e de limpeza',
    'Papel qualquer tipo e resmas',
    'TDI (Tolueno Di-Isocianato) e Dióxido de Titânio',
    'Artigos escolares e de papelaria',
    'Autopeças em geral, inclusive para motocicletas',
    'Brinquedos e Bicicletas (partes, peças e acessórios)',
    'Ferramentas Manuais ou elétricas (exemplos: furadeiras, serras elétricas, lixadeiras, entre outras)',
    'Fraldas descartáveis',
    'Fechaduras e ferragens em geral',
    'Kit Gás Veicular',
    'Materiais elétricos, interruptores, fusíveis e semelhantes',
    'Produtos Siderúrgicos',
    'Rolamentos em geral',
    'Tubos e conexões de PVC',
    'Artigos esportivos',
    'Tratores; Colheitadeiras; Empilhadeiras; Maquinas Agrícolas Automotrizes; Retro-escavadeiras; Pás Carregadeiras; Implementos Agrícolas; Cultivadores Motorizados',
    'Álcool etílico e para fins medicinais/farmacêuticos',
    'Produtos Químicos (que já não estejam específicados nesta tabela)',
    'Ração Animal',
    'Livros e revistas em geral',
  ],

  // Mercadorias Não Compreendidas no Seguro (lista de texto)
  exclusoes: [
    'apólices, bilhetes de loteria, cartões de crédito, cartões telefônicos e cartões de estacionamento em geral',
    'cheques, contas, comprovantes de débitos, e dinheiro, em moeda ou papel',
    'diamantes industriais, documentos e obrigações de qualquer espécie, e escrituras',
    'joias, pérolas em geral, pedras preciosas ou semipreciosas, metais preciosos e semipreciosos e suas ligas (trabalhadas ou não), notas e notas promissórias',
    'registros, títulos, selos e estampilhas',
    'talões de cheque, vales-alimentação e vale-refeição',
    'Algodão em plumas, fardos, rolos e prensados',
    'Antiguidades',
    'Aparelhos de telefonia celular, suas partes, peças e acessórios',
    'Armas, Munições e Explosivos',
    'Bagagem',
    'Café em geral',
    'Carnes e pescados in natura, congelados e resfriados',
    'Cerâmicas e Cristais',
    'Cigarros',
    'Cobre em geral',
    'Combustível',
    'Defensivos Agrícolas',
    'Farinha de peixe',
    'Granitos e Mármores',
    'Ladrilhos e Louças',
    'Lâmpadas',
    'Medicamentos em geral (de uso humano e/ou veterinário)',
    'Minérios em geral',
    'Pneus e câmaras de ar',
    'Porcelanas e Pisos cerâmicos',
    'Vacinas (de uso humano e/ou veterinário)',
    'Veículos de colecionador',
    'Veículos e motocicletas',
    'Vidros de qualquer tipo',
    'Vitaminas e suplementos alimentares',
    'Objetos de Arte (quadro, esculturas, antiguidades e coleções)',
    'Mudanças de móveis e utensílios (residenciais ou de escritórios)',
    'Animais vivos',
    'Veículos trafegando por meios próprios',
  ],

  // Risco Excluído por Embarcador (não por localização)
  embarcadoresExcluidos: [
    'LOJAS AMERICANAS S.A.',
    'B2W Companhia Digital',
    'PROCTER & GAMBLE DO BRASIL S.A. (P&G)',
  ],

  // Limites de Garantia
  limites: {
    geral: 1000000.0, // R$ 1.000.000,00 para demais mercadorias
    condicao1: {
      regra: 'Operacao DPaschoal (Pneus)',
      valor: 400000.0, // R$ 400.000,00 para operação DPaschoal (Pneus)
    },
    condicao2: {
      regra: 'Mercadorias Transportadas por moto/frete',
      valor: 10000.0, // R$ 10.000,00 para mercadorias transportadas por moto/frete
    },
  },

  // Emitente Autorizado
  emitenteAutorizado: {
    cnpj: '17.784.261/0001-42',
    nome: 'CANLOG BUSINESS & SOLUTIONS EIRELI',
  },

  // Condições Especiais de Origem e Destino
  localizacoesExcluidas: {
    origem: {
      permitidas: ['Qualquer Estado do Brasil'],
      excluidas: [], // A apólice não especifica exclusões de origem, apenas condições para áreas de risco.
    },
    destino: {
      permitidas: ['Qualquer Estado do Brasil'],
      excluidas: [], // A apólice não especifica exclusões de destino, apenas condições para áreas de risco.
    },
  },
};

// Função para gerar prompt das regras para a IA
export function generatePolicyPrompt() {
  return `
REGRAS DA APÓLICE DE SEGURO - VALIDAÇÃO DE CTe:

IMPORTANTE: As descrições de mercadorias no XML podem variar muito.
Use sua inteligência para identificar correspondências semânticas.

MERCADORIAS EXCLUÍDAS (NÃO COBERTAS):
${POLICY_RULES.exclusoes.map((item) => `- ${item}`).join('\n')}

LOCALIZAÇÕES EXCLUÍDAS:
- Origem: ${
    POLICY_RULES.localizacoesExcluidas.origem.excluidas.join(', ') || 'Nenhuma'
  }
- Destino: ${
    POLICY_RULES.localizacoesExcluidas.destino.excluidas.join(', ') || 'Nenhuma'
  }

LIMITES DE GARANTIA:
- Limite Geral: R$ ${POLICY_RULES.limites.geral.toLocaleString('pt-BR')}
- Limite para Condição 1:
  Regra: ${POLICY_RULES.limites.condicao1.regra}
  Valor: R$ ${POLICY_RULES.limites.condicao1.valor.toLocaleString('pt-BR')}
- Limite para Condição 2:
  Regra: ${POLICY_RULES.limites.condicao2.regra}
  Valor: R$ ${POLICY_RULES.limites.condicao2.valor.toLocaleString('pt-BR')}

EMITENTE AUTORIZADO:
- ${POLICY_RULES.emitenteAutorizado.nome} (CNPJ: ${
    POLICY_RULES.emitenteAutorizado.cnpj
  })

ORIGENS PERMITIDAS:
${POLICY_RULES.localizacoesExcluidas.origem.permitidas
  .map((item) => `- ${item}`)
  .join('\n')}

DESTINOS PERMITIDOS:
${POLICY_RULES.localizacoesExcluidas.destino.permitidas
  .map((item) => `- ${item}`)
  .join('\n')}

EMBARCADORES EXCLUÍDOS:
${POLICY_RULES.embarcadoresExcluidos.map((item) => `- ${item}`).join('\n')}

INSTRUÇÕES PARA ANÁLISE:
1. Analise a descrição das mercadorias do XML e identifique correspondências com as regras
2. Considere variações de linguagem, sinônimos e descrições técnicas
3. Verifique se valores não excedem limites de garantia
4. Valide se emitente é autorizado
5. Verifique se origem e destino são permitidos
6. Identifique mercadorias de risco A e B baseado na semântica
7. Verifique se localização não está excluída
`;
}
