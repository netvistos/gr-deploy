import xml2js from "xml2js";

/**
 * Validação básica do XML de CTe.
 * Retorna true se o XML contém as tags principais e estrutura mínima.
 */
export function isValidXML(xmlContent) {
  if (!xmlContent || typeof xmlContent !== "string") return false;
  const requiredTags = ["<cteProc", "<CTe", "<infCte"];
  const hasAllTags = requiredTags.every((tag) => xmlContent.includes(tag));
  if (!hasAllTags) return false;
  if (!xmlContent.includes("<") || !xmlContent.includes(">")) return false;
  return true;
}

/**
 * Função utilitária para extrair a data do transporte do bloco <ide>
 * Prioriza <dPrev>, depois <dhEmi> (apenas a data).
 */
function extractTransportDate(ide) {
  if (ide?.dPrev) return ide.dPrev;
  if (ide?.dhEmi) return ide.dhEmi.split("T")[0];
  return "";
}

/**
 * Parser XML simples para CTe.
 * Retorna objeto estruturado com os dados essenciais para validação.
 */
export async function parseCTeXML(xmlContent) {
  try {
    const parser = new xml2js.Parser({
      explicitArray: false,
      ignoreAttrs: true,
    });
    const result = await parser.parseStringPromise(xmlContent);
    const cte = result.cteProc?.CTe?.infCte;
    if (!cte) throw new Error("Estrutura XML inválida - CTe não encontrado");

    const extractedData = {
      emitente: {
        cnpj: cte.emit?.CNPJ || "",
        nome: cte.emit?.xNome || "",
      },
      data_transporte: extractTransportDate(cte.ide),
      embarcador: {
        cnpj: cte.rem?.CNPJ || "",
        nome: cte.rem?.xNome || "",
      },
      mercadoria: {
        nome: cte.infCTeNorm?.infCarga?.proPred || "",
        valor: parseFloat(cte.infCTeNorm?.infCarga?.vCarga) || 0,
      },
      origem: {
        municipio: cte.ide?.xMunIni || "",
        uf: cte.ide?.UFIni || "",
      },
      destino: {
        municipio: cte.ide?.xMunFim || "",
        uf: cte.ide?.UFFim || "",
      },
    };

    return extractedData;
  } catch (error) {
    console.error("Erro ao fazer parse do XML:", error);
    throw new Error(`Falha no parse do XML: ${error.message}`);
  }
}
