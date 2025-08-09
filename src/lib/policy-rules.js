// Regras da Apólice de Seguro para Validação de CTe
// Baseado na planilha de regras fornecida
export const POLICY_RULES = {
  emitente: {
    cnpj: "13.657.062/0001-12",
    nome: "LOGITIME TRANSPORTES LTDA",
    vigencia: "19/10/2024 até 31/10/2026",
  },

  bensOuMercadoriasExcluidas: {
    condicao_1: {
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
    condicao_2: {
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
    condicao_3: {
      regra: "Qualquer mercadoria que se esteja na lista a seguir estará proibida",
      mercadorias: [
        "Mudanças de móveis e utensílios (residenciais ou de escritório)",
        "Animais vivos",
        "Objetos de arte (quadros, esculturas, antiguidades e coleções)",
      ],
    },
  },

  clausulasEspecificasDeExclusao: {
    condicao: {
      regra: "Cláusula específica de exclusão de armas químicas",
      mercadorias: [
        "Armas Químicas, Biológicas, Bioquímicas, Eletromagnéticas e de Ataque Cibernético",
      ],
    },
  },

  regrasDeGerenciamentoDeRiscos: {
    condicao_1: {
      mercadorias: [
        "Aparelhos de telefonia celular, suas partes, peças e seus acessórios",
        "Café de qualquer tipo",
        "Carne congelada, in natura e charque",
        "Cobre (qualquer tipo)",
        "Combustíveis e seus derivados",
        "Computadores e Periféricos (Notebook, Desktop, Teclados, Monitores, CPUs, Processadores, Memorias, Kit Multimídia e semelhantes)",
        "Defensivos Agrícolas",
        "Estanho (qualquer tipo)",
        "Ferro Vanádio (qualquer tipo)",
        "Medicamentos de qualquer tipo (de uso humano e/ou veterinário)",
        "Minério de molibdênio (qualquer tipo)",
        "Nióbio de ferro (qualquer tipo)",
        "Tablets em Geral",
      ],
      regras: {
        regra_1: {
          valorMercadoria: "igual ou superior a R$ 40.000,00",
          obrigatoriedade: "análise de perfil profissional",
        },
        regra_2: {
          valorMercadoria: "igual ou superior a R$ 40.000,01 até R$ 350.000,00",
          obrigatoriedade: [
            "análise de perfil profissional",
            "rastreamento / monitoramento de cargas",
          ],
        },
        regra_3: {
          valorMercadoria:
            "igual ou superior a R$ 350.000,01 até R$ 600.000,00",
          obrigatoriedade: [
            "análise de perfil profissional",
            "rastreamento / monitoramento de carga",
            "acompanhamento de escolta armada e monitorada do início ao fim do risco",
            "Isca Eletrônica RF",
            "Imobilizador Inteligente",
            "Proibido Autônomo",
          ],
        },
        regra_4: {
          valorMercadoria:
            "igual ou superior a R$ 600.000,01 até R$ 1.000.000,00",
          obrigatoriedade: [
            "análise de perfil profissional",
            "rastreamento / monitoramento de carga",
            "acompanhamento de escolta armada e monitorada do início ao fim do risco",
            "Imobilizador Inteligente",
            "Isca Eletrônica RF",
          ],
        },
      },
    },
    condicao_2: {
      mercadorias: [
        "Aço e Ferro em geral",
        "Álcool Etílico e para fins medicinais/farmacêuticos",
        "Algodão de qualquer tipo",
        "Alumínio em geral (perfis, tubos, chapas, bobinas, folhas, lingotes, tarugos, vergalhões, etc.)",
        "Açúcar, Arroz e Trigo",
        "Aparelhos Eletroeletrônicos de Som e Imagem",
        "Artigos de higiene e limpeza",
        "Artigos escolares e de papelaria",
        "Artigos esportivos",
        "Artigos, filmes e máquinas fotográficas",
        "Autopeças inclusive para motocicleta",
        "Bacalhau",
        "Balas, chocolates, chiclete e doces em geral",
        "Baterias automotivas",
        "Bebidas em geral",
        "Brinquedos e Bicicletas (partes, peças e acessórios)",
        "Cabos de Fibra Óptica",
        "Calçados em geral (tênis, sapatos, chinelos, sandálias), solados, palmilhas e correias",
        "Capas e películas para aparelho celular",
        "Cartuchos para impressoras e copiadoras",
        "Cassiterita (qualquer tipo)",
        "CD (Compact Disc)/ LD (Laser Disc) / DVD / Blu-ray",
        "Confecções, fios de seda, fios têxteis e tecidos",
        "Cosméticos/ Perfumes",
        "Couro Cru, Wetblue (semi-acabado) ou beneficiado",
        "Eletrodomésticos",
        "Empilhadeiras",
        "Equipamento Médico Hospitalar",
        "Fechaduras e Ferragens em geral",
        "Ferramentas Manuais ou elétricas (por exemplo, furadeiras, serras elétricas, lixadeiras, etc.)",
        "Fertilizantes",
        "Fios ou cabos elétricos e de telefonia",
        "Fraldas descartáveis",
        "Granitos e Mármores",
        "Impressoras em geral",
        "Lâmpadas (reatores, luminárias e periféricos)",
        "Latão e Folhas de Flandres",
        "Leite em pó ou condensado",
        "Livros e revistas em geral",
        "Materiais elétricos, interruptores, fuzis e semelhantes",
        "Níquel (qualquer tipo)",
        "Óleos comestíveis e óleos lubrificantes",
        "Pneus e câmaras de ar",
        "Papel de qualquer tipo, resmas e celulose",
        "Pilhas e baterias",
        "Polímeros e seus derivados (Polietileno, polipropileno, Policloreto de vinila, etc.)",
        "Porcelanas e Pisos Cerâmicos",
        "Produtos alimentícios em geral",
        "Produtos farmacêuticos (exceto medicamentos)",
        "Produtos Siderúrgicos",
        "Produtos químicos em geral (inclusive de uso veterinário)",
        "Produtos óticos em geral",
        "Relógios (Valor por Unidade inferior a R$ 2.000,00)",
        "Rolamentos em geral",
        "Sémen bovino, acondicionado em cilindro de nitrogênio",
        "TDI (Tolueno de Isocianato), dióxido de titânio, tolueno refinado, silício metálico",
        "Tintas, Vernizes, Corantes, Pigmentos e Similares",
        "Tratores, máquinas e implementos agrícolas",
        "Tubos e conexões de PVC e Resinas de PVC",
        "Veículos transportados em veículo cegonheira/container",
        "Vidros em geral",
        "Vitaminas e suplementos alimentares",
        "Zinco (qualquer tipo)",
      ],
      regras: {
        regra_1: {
          valorMercadoria: "até R$ 200.000,00",
          obrigatoriedade: "análise de perfil profissional",
        },
        regra_2: {
          valorMercadoria: "de R$ 200.000,01 até R$ 1.000.000,00",
          obrigatoriedade: [
            "análise de perfil profissional",
            "rastreamento / monitoramento de cargas OU acompanhamento de escolta armada e monitorada do início ao fim do risco",
          ],
        },
        regra_3: {
          valorMercadoria: "de R$ 1.000.000,01 até R$ 2.500.000,00",
          obrigatoriedade: [
            "análise de perfil profissional",
            "rastreamento / monitoramento de cargas",
            "acompanhamento de escolta armada e monitorada do início ao fim do risco",
          ],
        },
        regra_4: {
          valorMercadoria: "de R$ 2.500.000,01 até R$ 3.000.000,00",
          obrigatoriedade: [
            "análise de perfil profissional",
            "rastreamento / monitoramento de cargas",
            "acompanhamento de escolta armada e monitorada do início ao fim do risco OU Isca Eletrônica RF e Imobilizador Inteligente",
          ],
        },
        regra_5: {
          valorMercadoria: "de R$ 2.000.000,00",
          obrigatoriedade: "MOTORISTA FROTA",
        },
      },
    },
    condicao_3: {
      mercadoria:
        "exclusivamente sêmen bovino E acondicionado em cilindro de nitrogênio",
      regras: {
        regra_1: {
          valorMercadoria: "até R$ 150.000,00",
          obrigatoriedade: "análise de perfil profissional",
        },
        regra_2: {
          valorMercadoria: "de R$ 150.000,01 até R$ 1.000.000,00",
          obrigatoriedade: [
            "análise de perfil profissional",
            "rastreamento / monitoramento de cargas OU acompanhamento de escolta armada e monitorada do início ao fim do risco",
          ],
        },
        regra_3: {
          valorMercadoria: "de R$ 1.000.000,01 até R$ 3.500.000,00",
          obrigatoriedade: [
            "análise de perfil profissional",
            "rastreamento / monitoramento de cargas",
            "acompanhamento de escolta armada e monitorada do início ao fim do risco OU Isca Eletrônica RF OU Imobilizador Inteligente",
          ],
        },
      },
    },
    condicao_4: {
      mercadoria: "Máquinas e equipamentos pesados novos e sem uso",
      regras: {
        regra_1: {
          valorMercadoria: "até R$ 4.000.000,00",
          obrigatoriedade: "análise de perfil profissional",
        },
      },
    },
    condicao_5: {
      embarcador: "MANN+HUMMEL BRASIL LTDA",
      regras: {
        regra_1: {
          valorMercadoria: "até R$ 300.000,00",
          obrigatoriedade: "análise de perfil profissional",
        },
        regra_2: {
          valorMercadoria: "de R$ 300.000,01 até R$ 1.000.000,00",
          obrigatoriedade: [
            "análise de perfil profissional",
            "rastreamento / monitoramento de cargas OU acompanhamento de escolta armada e monitorada do início ao fim do risco",
          ],
        },
        regra_3: {
          valorMercadoria: "de R$ 1.000.000,01 até R$ 2.500.000,00",
          obrigatoriedade: [
            "análise de perfil profissional",
            "rastreamento / monitoramento de cargas",
            "acompanhamento de escolta armada e monitorada do início ao fim do risco OU Isca Eletrônica RF OU Imobilizador Inteligente",
          ],
        },
        regra_4: {
          valorMercadoria: "de R$ 2.500.000,01 até R$ 3.000.000,00",
          obrigatoriedade: [
            "análise de perfil profissional",
            "rastreamento / monitoramento de cargas",
            "acompanhamento de escolta armada e monitorada do início ao fim do risco OU Isca Eletrônica RF E Imobilizador Inteligente",
          ],
        },
        regra_5: {
          valorMercadoria: "igual ou superior a R$ 2.000.000,00",
          obrigatoriedade: "MOTORISTA FROTA",
        },
      },
    },
    condicao_6: {
      mercadoria: "painel solar",
      origemDestino: "proibido para origem ou destino do Rio de Janeiro",
      regras: {
        regra_1: {
          valorMercadoria: "até R$ 80.000,00",
          obrigatoriedade: "análise de perfil profissional",
        },
        regra_2: {
          valorMercadoria: "de R$ 80.000,01 até R$ 500.000,00",
          obrigatoriedade: [
            "análise de perfil profissional",
            "rastreamento / monitoramento de cargas",
          ],
        },
        regra_3: {
          valorMercadoria: "de R$ 500.000,01 até R$ 800.000,00",
          obrigatoriedade: [
            "análise de perfil profissional",
            "rastreamento / monitoramento de cargas",
            "acompanhamento de escolta armada e monitorada do início ao fim do risco OU 01 Fiscal de Rota OU Imobilizador Inteligente",
          ],
        },
        regra_4: {
          valorMercadoria: "de R$ 800.000,01 até R$ 1.200.000,00",
          obrigatoriedade: [
            "análise de perfil profissional",
            "rastreamento / monitoramento de cargas",
            "acompanhamento de escolta armada e monitorada do início ao fim do risco OU 01 Fiscal de Rota OU Imobilizador Inteligente",
          ],
        },
        regra_5: {
          valorMercadoria: "de R$ 1.200.000,01 até R$ 1.500.000,00",
          obrigatoriedade: [
            "análise de perfil profissional",
            "rastreamento / monitoramento de cargas",
            "acompanhamento de escolta armada e monitorada do início ao fim do risco OU Imobilizador Inteligente E Lacre Eletrônico E Isca Eletrônica",
          ],
        },
        regra_6: {
          valorMercadoria: "de R$ 1.500.000,01 até R$ 3.000.000,00",
          obrigatoriedade: [
            "análise de perfil profissional",
            "rastreamento / monitoramento de cargas",
            "acompanhamento de escolta armada e monitorada do início ao fim do risco OU 01 Fiscal de Rota E Isca Eletrônica E Imobilizador Inteligente",
          ],
        },
      },
    },
    condicao_7: {
      embarcador: "BYD MAN",
      mercadoria: [
        "Células de baterias e partes e peças para uso em Ônibus elétrico",
        "filtro de ar para veículos e partes",
        "peças de veículos elétricos",
      ],
      veiculo: "BITREM OU TRUCK",
      regras: {
        regra_1: {
          valorMercadoria: "até R$ 500.000,00",
          obrigatoriedade: "análise de perfil profissional",
        },
        2: {
          valorMercadoria: "de R$ 500.000,01 até R$ 1.500.000,00",
          obrigatoriedade: [
            "análise de perfil profissional",
            "rastreamento / monitoramento de cargas",
          ],
        },
        regra_3: {
          valorMercadoria: "de R$ 1.500.000,01 até R$ 2.500.000,00",
          obrigatoriedade: [
            "análise de perfil profissional",
            "rastreamento / monitoramento de cargas",
            "Isca Eletrônica RF OU Imobilizador Inteligente OU Escolta Ostensiva OU 01 Fiscal de Rota em percurso integral",
          ],
        },
        regra_4: {
          valorMercadoria: "de R$ 2.500.000,01 até R$ 5.000.000,00",
          obrigatoriedade: [
            "análise de perfil profissional",
            "rastreamento / monitoramento de cargas",
            "Isca Eletrônica RF E Imobilizador Inteligente OU Escolta Ostensiva OU 01 Fiscal de Rota em percurso integral OU 02 Iscas Eletrônicas",
          ],
        },
        regra_5: {
          valorMercadoria: "de R$ 5.000.000,01 até R$ 8.000.000,00",
          obrigatoriedade: [
            "análise de perfil profissional",
            "rastreamento / monitoramento de cargas",
            "02 Iscas Eletrônicas RF",
            "Imobilizador Inteligente",
            "Escolta Armada",
          ],
        },
      },
    },
    condicao_8: {
      embarcador: "BYD MAN",
      mercadoria: "painel solar",
      veiculo: "BITREM",
      regras: {
        regra_1: {
          valorMercadoria: "até R$ 80.000,00",
          obrigatoriedade: "análise de perfil profissional",
        },
        2: {
          valorMercadoria: "de R$ 80.000,01 até R$ 500.000,00",
          obrigatoriedade: [
            "análise de perfil profissional",
            "rastreamento / monitoramento de cargas",
          ],
        },
        regra_3: {
          valorMercadoria: "de R$ 500.000,01 até R$ 1.000.000,00",
          obrigatoriedade: [
            "análise de perfil profissional",
            "rastreamento / monitoramento de cargas",
            "Isca Eletrônica RF OU Imobilizador Inteligente OU Escolta Ostensiva OU 01 Fiscal de Rota em percurso integral",
          ],
        },
        regra_4: {
          valorMercadoria: "de R$ 1.000.000,01 até R$ 1.500.000,00",
          obrigatoriedade: [
            "análise de perfil profissional",
            "rastreamento / monitoramento de cargas",
            "Isca Eletrônica E Escolta Armada OU Imobilizador Inteligente E Lacre Eletrônico",
          ],
        },
        regra_5: {
          valorMercadoria: "de R$ 1.500.000,01 até R$ 3.000.000,00",
          obrigatoriedade: [
            "análise de perfil profissional",
            "rastreamento / monitoramento de cargas",
            "Escolta Armada OU Fiscal de Rota E Isca Eletrônica E Imobilizador Inteligente OU 01 Fiscal de Rota",
          ],
        },
        regra_6: {
          valorMercadoria: "de R$ 3.000.000,01 até R$ 5.000.000,00",
          obrigatoriedade: [
            "análise de perfil profissional",
            "rastreamento / monitoramento de cargas",
            "02 Escoltas Armadas",
            "02 Iscas Eletrônicas",
            "Imobilizador Inteligente",
            "01 Fiscal de Rota",
          ],
        },
        regra_7: {
          valorMercadoria: "de R$ 5.000.000,01 até R$ 7.000.000,00",
          obrigatoriedade: [
            "análise de perfil profissional",
            "rastreamento / monitoramento de cargas",
            "02 Escoltas Armadas",
            "02 Iscas Eletrônicas",
            "Imobilizador Inteligente",
            "01 Fiscal de Rota",
          ],
        },
        regra_8: {
          valorMercadoria: "de R$ 7.000.000,01 até R$ 10.000.000,00",
          obrigatoriedade: [
            "análise de perfil profissional",
            "rastreamento / monitoramento de cargas",
            "03 Escoltas Armadas",
            "02 Iscas Eletrônicas",
            "Imobilizador Inteligente",
            "01 Fiscal de Rota",
          ],
        },
      },
    },
    condicao_9: {
      embarcador: "MIBA",
      origemDestino: "proibido para origem ou destino do Rio de Janeiro",
      regras: {
        regra_1: {
          valorMercadoria: "até R$ 300.000,00",
          obrigatoriedade: "análise de perfil profissional",
        },
        regra_2: {
          valorMercadoria: "de R$ 300.000,01 até R$ 800.000,00",
          obrigatoriedade: [
            "análise de perfil profissional",
            "rastreamento / monitoramento de cargas",
          ],
        },
      },
    },

    condicao_10: {
      mercadoria:
        "aeronaves desmontadas, inclusive suas partes e peças e acessórios",
      regras: {
        regra_1: {
          valorMercadoria: "até R$ 300.000,00",
          obrigatoriedade: "análise de perfil profissional",
        },
        regra_2: {
          valorMercadoria: "de R$ 300.000,01 até R$ 1.000.000,00",
          obrigatoriedade: [
            "análise de perfil profissional",
            "rastreamento / monitoramento de cargas",
          ],
        },
        regra_3: {
          valorMercadoria: "de R$ 1.000.000,01 até R$ 2.000.000,00",
          obrigatoriedade: [
            "análise de perfil profissional",
            "rastreamento / monitoramento de cargas",
            "Trava de quinta roda OU Sensor de Desengate",
          ],
        },
      },
    },
  },
  limiteMaximoGarantia: {
    regra:
      "Para todas as mercadorias que não se enquadram em nenhuma condição específica, o limite máximo de cobertura é de R$ 3.000.000,00",
    valorMaximo: "3.000.000,00",
    
  },
};

// // Função para gerar prompt das regras para a IA
// export function generatePolicyPrompt() {
//   return `
// ═══════════════════════════════════════════════════════════════════════
//                     APÓLICE DE SEGURO DE TRANSPORTE
//                       REGRAS PARA VALIDAÇÃO DE CTe
// ═══════════════════════════════════════════════════════════════════════

// 📋 DADOS DO EMITENTE
// ────────────────────────────────────────────────────────────────
// CNPJ: ${POLICY_RULES.emitente.cnpj}
// Nome: ${POLICY_RULES.emitente.nome}
// Vigência: ${POLICY_RULES.emitente.vigencia}

// ────────────────────────────────────────────────────────────────

// 🚫 CONDIÇÕES PARA EXCLUSÃO DE BENS OU MERCADORIAS

// 【CONDIÇÃO_1】Mercadorias Totalmente Proibidas
// Regra: ${POLICY_RULES.condicoesParaExclusaoDeBensOuMercadorias.condicao_1.regra}

// Lista de mercadorias proibidas:
// ${POLICY_RULES.condicoesParaExclusaoDeBensOuMercadorias.condicao_1.mercadorias
//   .map((item) => `  • ${item}`)
//   .join("\n")}

// 【CONDIÇÃO_2】Mercadorias Proibidas para Rio de Janeiro
// Regra: ${POLICY_RULES.condicoesParaExclusaoDeBensOuMercadorias.condicao_2.regra}

// Lista de mercadorias proibidas para RJ:
// ${POLICY_RULES.condicoesParaExclusaoDeBensOuMercadorias.condicao_2.mercadorias
//   .map((item) => `  • ${item}`)
//   .join("\n")}

// 【CONDIÇÃO_3】Mercadorias com Condições Especiais
// Regra: ${POLICY_RULES.condicoesParaExclusaoDeBensOuMercadorias.condicao_3.regra}

// Lista de mercadorias:
// ${POLICY_RULES.condicoesParaExclusaoDeBensOuMercadorias.condicao_3.mercadorias
//   .map((item) => `  • ${item}`)
//   .join("\n")}

// ────────────────────────────────────────────────────────────────

// ☢️ CLÁUSULAS ESPECÍFICAS DE EXCLUSÃO

// Regra: ${POLICY_RULES.clausulasEspecificasDeExclusao.condicao.regra}

// Mercadorias excluídas:
// ${POLICY_RULES.clausulasEspecificasDeExclusao.condicao.mercadorias
//   .map((item) => `  • ${item}`)
//   .join("\n")}

// ────────────────────────────────────────────────────────────────

// ⚠️ REGRAS DE GERENCIAMENTO DE RISCOS

// 【RISCO A】
// Mercadorias aplicáveis:
// ${POLICY_RULES.regrasDeGerenciamentoDeRiscos.riscoA.mercadorias
//   .map((item) => `  • ${item}`)
//   .join("\n")}

// Regras por valor:
// ${Object.entries(POLICY_RULES.regrasDeGerenciamentoDeRiscos.riscoA.regras)
//   .map(([key, regra]) => {
//     const obrig = Array.isArray(regra.obrigatoriedade)
//       ? regra.obrigatoriedade.map((item) => `    - ${item}`).join("\n")
//       : `    - ${regra.obrigatoriedade}`;
//     return `  ${key}. Valor ${regra.valorMercadoria}:\n${obrig}`;
//   })
//   .join("\n\n")}

// 【RISCO B】
// Mercadorias aplicáveis:
// ${POLICY_RULES.regrasDeGerenciamentoDeRiscos.riscoB.mercadorias
//   .map((item) => `  • ${item}`)
//   .join("\n")}

// Regras por valor:
// ${Object.entries(POLICY_RULES.regrasDeGerenciamentoDeRiscos.riscoB.regras)
//   .map(([key, regra]) => {
//     const valor = regra.valorMercadoria || regra.valorMercaria;
//     const obrig = Array.isArray(regra.obrigatoriedade)
//       ? regra.obrigatoriedade.map((item) => `    - ${item}`).join("\n")
//       : `    - ${regra.obrigatoriedade}`;
//     return `  ${key}. Valor ${valor}:\n${obrig}`;
//   })
//   .join("\n\n")}

// 【RISCO - SÊMEN BOVINO】
// Mercadoria: ${POLICY_RULES.regrasDeGerenciamentoDeRiscos.semenBovino.mercadoria}

// Regras por valor:
// ${Object.entries(POLICY_RULES.regrasDeGerenciamentoDeRiscos.semenBovino.regras)
//   .map(([key, regra]) => {
//     const obrig = Array.isArray(regra.obrigatoriedade)
//       ? regra.obrigatoriedade.map((item) => `    - ${item}`).join("\n")
//       : `    - ${regra.obrigatoriedade}`;
//     return `  ${key}. Valor ${regra.valorMercadoria}:\n${obrig}`;
//   })
//   .join("\n\n")}

// 【RISCO - MÁQUINAS E EQUIPAMENTOS PESADOS】
// Mercadoria: ${
//     POLICY_RULES.regrasDeGerenciamentoDeRiscos.maquinasEquipamentosPesados
//       .mercadoria
//   }

// Regras por valor:
// ${Object.entries(
//   POLICY_RULES.regrasDeGerenciamentoDeRiscos.maquinasEquipamentosPesados.regras
// )
//   .map(([key, regra]) => {
//     return `  ${key}. Valor ${regra.valorMercadoria}:\n    - ${regra.obrigatoriedade}`;
//   })
//   .join("\n\n")}

// 【RISCO - EMBARCADOR MANN+HUMMEL】
// Embarcador: ${
//     POLICY_RULES.regrasDeGerenciamentoDeRiscos.embarcadorMannHummel.embarcador
//   }

// Regras por valor:
// ${Object.entries(
//   POLICY_RULES.regrasDeGerenciamentoDeRiscos.embarcadorMannHummel.regras
// )
//   .map(([key, regra]) => {
//     const obrig = Array.isArray(regra.obrigatoriedade)
//       ? regra.obrigatoriedade.map((item) => `    - ${item}`).join("\n")
//       : `    - ${regra.obrigatoriedade}`;
//     return `  ${key}. Valor ${regra.valorMercadoria}:\n${obrig}`;
//   })
//   .join("\n\n")}

// 【RISCO - PAINEL SOLAR】
// Mercadoria: ${POLICY_RULES.regrasDeGerenciamentoDeRiscos.painelSolar.mercadoria}
// Restrição: ${
//     POLICY_RULES.regrasDeGerenciamentoDeRiscos.painelSolar.origemDestino
//   }

// Regras por valor:
// ${Object.entries(POLICY_RULES.regrasDeGerenciamentoDeRiscos.painelSolar.regras)
//   .map(([key, regra]) => {
//     const obrig = Array.isArray(regra.obrigatoriedade)
//       ? regra.obrigatoriedade.map((item) => `    - ${item}`).join("\n")
//       : `    - ${regra.obrigatoriedade}`;
//     return `  ${key}. Valor ${regra.valorMercadoria}:\n${obrig}`;
//   })
//   .join("\n\n")}

// 【RISCO - OPERAÇÃO BYD MAN】
// Embarcador: ${
//     POLICY_RULES.regrasDeGerenciamentoDeRiscos.operacaoBydMan.embarcador
//   }
// Mercadorias: ${POLICY_RULES.regrasDeGerenciamentoDeRiscos.operacaoBydMan.mercadoria.join(
//     ", "
//   )}
// Veículo permitido: ${
//     POLICY_RULES.regrasDeGerenciamentoDeRiscos.operacaoBydMan.veiculo
//   }

// Regras por valor:
// ${Object.entries(
//   POLICY_RULES.regrasDeGerenciamentoDeRiscos.operacaoBydMan.regras
// )
//   .map(([key, regra]) => {
//     const obrig = Array.isArray(regra.obrigatoriedade)
//       ? regra.obrigatoriedade.map((item) => `    - ${item}`).join("\n")
//       : `    - ${regra.obrigatoriedade}`;
//     return `  ${key}. Valor ${regra.valorMercadoria}:\n${obrig}`;
//   })
//   .join("\n\n")}

// 【RISCO - OPERAÇÃO BYD MAN - PAINEL SOLAR】
// Embarcador: ${
//     POLICY_RULES.regrasDeGerenciamentoDeRiscos.operacaoBydManPainelSolar
//       .embarcador
//   }
// Mercadoria: ${
//     POLICY_RULES.regrasDeGerenciamentoDeRiscos.operacaoBydManPainelSolar
//       .mercadoria
//   }
// Veículo permitido: ${
//     POLICY_RULES.regrasDeGerenciamentoDeRiscos.operacaoBydManPainelSolar.veiculo
//   }

// Regras por valor:
// ${Object.entries(
//   POLICY_RULES.regrasDeGerenciamentoDeRiscos.operacaoBydManPainelSolar.regras
// )
//   .map(([key, regra]) => {
//     const obrig = Array.isArray(regra.obrigatoriedade)
//       ? regra.obrigatoriedade.map((item) => `    - ${item}`).join("\n")
//       : `    - ${regra.obrigatoriedade}`;
//     return `  ${key}. Valor ${regra.valorMercadoria}:\n${obrig}`;
//   })
//   .join("\n\n")}

// 【RISCO - OPERAÇÃO MIBA】
// Embarcador: ${
//     POLICY_RULES.regrasDeGerenciamentoDeRiscos.operacaoMiba.embarcador
//   }
// Restrição: ${
//     POLICY_RULES.regrasDeGerenciamentoDeRiscos.operacaoMiba.origemDestino
//   }

// Regras por valor:
// ${Object.entries(POLICY_RULES.regrasDeGerenciamentoDeRiscos.operacaoMiba.regras)
//   .map(([key, regra]) => {
//     const obrig = Array.isArray(regra.obrigatoriedade)
//       ? regra.obrigatoriedade.map((item) => `    - ${item}`).join("\n")
//       : `    - ${regra.obrigatoriedade}`;
//     return `  ${key}. Valor ${regra.valorMercadoria}:\n${obrig}`;
//   })
//   .join("\n\n")}

// 【RISCO - AERONAVES DESMONTADAS】
// Mercadoria: ${
//     POLICY_RULES.regrasDeGerenciamentoDeRiscos.aeronavesDesmontadas.mercadoria
//   }

// Regras por valor:
// ${Object.entries(
//   POLICY_RULES.regrasDeGerenciamentoDeRiscos.aeronavesDesmontadas.regras
// )
//   .map(([key, regra]) => {
//     const obrig = Array.isArray(regra.obrigatoriedade)
//       ? regra.obrigatoriedade.map((item) => `    - ${item}`).join("\n")
//       : `    - ${regra.obrigatoriedade}`;
//     return `  ${key}. Valor ${regra.valorMercadoria}:\n${obrig}`;
//   })
//   .join("\n\n")}

// ────────────────────────────────────────────────────────────────

// 💰 LIMITE DE COBERTURA

// Regra: ${POLICY_RULES.limiteMaximoGarantia.regra}
// Valor Máximo: R$ ${POLICY_RULES.limiteMaximoGarantia.valorMaximo}

// ────────────────────────────────────────────────────────────────

// `;
// }
