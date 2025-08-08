import xml2js from "xml2js";

// Função para formatar data do CT-e
function formatarDataCTe(dataString) {
  if (!dataString) return "";

  try {
    // Converter a string ISO para objeto Date
    const data = new Date(dataString);

    // Verificar se a data é válida
    if (isNaN(data.getTime())) {
      return dataString; // Retorna a string original se não conseguir converter
    }

    // Formatar para o padrão brasileiro
    const dia = data.getDate().toString().padStart(2, "0");
    const mes = (data.getMonth() + 1).toString().padStart(2, "0");
    const ano = data.getFullYear();

    return `${dia}/${mes}/${ano}`;
  } catch (error) {
    console.error("Erro ao formatar data:", error);
    return dataString; // Retorna a string original em caso de erro
  }
}

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
      throw new Error("Estrutura XML inválida - CTe não encontrado");
    }

    // Extrair dados essenciais
    const extractedData = {
      // Dados do emitente
      emitente: {
        cnpj: cte.emit?.CNPJ || "",
        nome: cte.emit?.xNome || "",
      },

      // Data do transporte
      dataTransporte: formatarDataCTe(cte.ide?.dhEmi || ""),
      dataTransporteOriginal: cte.ide?.dhEmi || "", // Data original para referência

      // Dados das mercadorias
      mercadoria: {
        descricao: cte.infCTeNorm?.infCarga?.proPred || "",
        valor: parseFloat(cte.infCTeNorm?.infCarga?.vCarga) || 0,
      },

      // Dados de origem e destino
      transporte: {
        origem: {
          municipio: cte.ide?.xMunIni || "",
          uf: cte.ide?.UFIni || "",
        },
        destino: {
          municipio: cte.ide?.xMunFim || "",
          uf: cte.ide?.UFFim || "",
        },
        informacoesTransporte: cte.ide?.natOp || "",
      },
    };

    return extractedData;
  } catch (error) {
    console.error("Erro ao fazer parse do XML:", error);
    throw new Error(`Falha no parse do XML: ${error.message}`);
  }
}

// Função para formatar dados para envio à IA
export function formatDataForAI(extractedData) {
  return {
    emitente: `${extractedData.emitente.nome} (CNPJ: ${extractedData.emitente.cnpj})`,
    dataTransporte: extractedData.transporte.dataTransporte,
    mercadoria: extractedData.mercadoria.descricao,
    valorMercadoria: extractedData.mercadoria.valor,
    origem: `${extractedData.transporte.origem.municipio} - ${extractedData.transporte.origem.uf}`,
    destino: `${extractedData.transporte.destino.municipio} - ${extractedData.transporte.destino.uf}`,
  };
}
