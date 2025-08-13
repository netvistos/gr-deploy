import xml2js from "xml2js";

/** Validação básica do XML de CTe. */
export function isValidXML(xmlContent) {
  if (!xmlContent || typeof xmlContent !== "string") return false;
  const requiredTags = ["<cteProc", "<CTe", "<infCte"];
  const hasAllTags = requiredTags.every((tag) => xmlContent.includes(tag));
  if (!hasAllTags) return false;
  if (!xmlContent.includes("<") || !xmlContent.includes(">")) return false;
  return true;
}

/** Extrai a data do transporte do bloco <ide> (prioriza dPrev, senão dhEmi yyyy-mm-dd). */
function extractTransportDateISO(ide) {
  if (ide?.dPrev) return ide.dPrev; // já costuma vir yyyy-mm-dd
  if (ide?.dhEmi) return ide.dhEmi.split("T")[0];
  return "";
}

/** Parser XML → objeto CTe padronizado para o fluxo. */
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
      issuer: {
        cnpj: cte.emit?.CNPJ || "",
        name: cte.emit?.xNome || "",
      },
      transport_date: extractTransportDateISO(cte.ide), // yyyy-mm-dd
      shipper: {
        cnpj: cte.rem?.CNPJ || "",
        name: cte.rem?.xNome || "",
      },
      goods: {
        name: cte.infCTeNorm?.infCarga?.proPred || "",
        value_brl: Number(cte.infCTeNorm?.infCarga?.vCarga) || 0,
      },
      origin: {
        city: cte.ide?.xMunIni || "",
        uf: cte.ide?.UFIni || "",
      },
      destination: {
        city: cte.ide?.xMunFim || "",
        uf: cte.ide?.UFFim || "",
      },
    };

    return extractedData;
  } catch (error) {
    console.error("Erro ao fazer parse do XML:", error);
    throw new Error(`Falha no parse do XML: ${error.message}`);
  }
}
