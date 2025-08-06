import xml2js from 'xml2js';

// Parser XML simples para CTe
export async function parseCTeXML(xmlContent) {
  try {
    // Configurar parser XML
    const parser = new xml2js.Parser({
      explicitArray: false, // Não criar arrays para elementos únicos
      ignoreAttrs: true, // Ignorar atributos para simplificar
    });

    // Fazer parse do XML
    const result = await parser.parseStringPromise(xmlContent);

    // Extrair dados do CTe
    const cte = result.cteProc?.CTe?.infCte;

    if (!cte) {
      throw new Error('Estrutura XML inválida - CTe não encontrado');
    }

    // Extrair dados essenciais
    const extractedData = {
      // Dados do emitente
      emitente: {
        cnpj: cte.emit?.CNPJ || '',
        nome: cte.emit?.xNome || '',
        fantasia: cte.emit?.xFant || '',
      },

      // Dados das mercadorias
      mercadoria: {
        descricao: cte.infCTeNorm?.infCarga?.proPred || '',
        valor: parseFloat(cte.infCTeNorm?.infCarga?.vCarga) || 0,
      },

      // Dados de origem e destino
      transporte: {
        origem: {
          municipio: cte.ide?.xMunIni || '',
          uf: cte.ide?.UFIni || '',
        },
        destino: {
          municipio: cte.ide?.xMunFim || '',
          uf: cte.ide?.UFFim || '',
        },
        informacoesTransporte: cte.ide?.natOp || '',
      },
    };

    return extractedData;
  } catch (error) {
    console.error('Erro ao fazer parse do XML:', error);
    throw new Error(`Falha no parse do XML: ${error.message}`);
  }
}

// Função auxiliar para validar se é um XML válido
export function isValidXML(xmlContent) {
  try {
    // Verificação básica - deve começar com <?xml
    if (!xmlContent.trim().startsWith('<?xml')) {
      return false;
    }

    // Verificar se contém tags do CTe
    if (!xmlContent.includes('<CTe') || !xmlContent.includes('</CTe>')) {
      return false;
    }

    return true;
  } catch (error) {
    return false;
  }
}

// Função para formatar dados para envio à IA
export function formatDataForAI(extractedData) {
  return {
    emitente: `${extractedData.emitente.nome} (CNPJ: ${extractedData.emitente.cnpj})`,
    mercadoria: extractedData.mercadoria.descricao,
    valorMercadoria: extractedData.mercadoria.valor,
    origem: `${extractedData.transporte.origem.municipio} - ${extractedData.transporte.origem.uf}`,
    destino: `${extractedData.transporte.destino.municipio} - ${extractedData.transporte.destino.uf}`,
    informacoesTransporte: extractedData.transporte.informacoesTransporte,
  };
}
