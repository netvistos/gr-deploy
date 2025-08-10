import { normalizeCNPJ, isDateWithinPolicy } from './validateCTe';
import { POLICY_RULES } from './policyRules';

export async function cteValidator(extractedData) {
  // 1. Validação do CNPJ
  const cnpjXML = normalizeCNPJ(extractedData.emitente.cnpj);
  const cnpjPolicy = normalizeCNPJ(POLICY_RULES.emitente.cnpj);
  if (cnpjXML !== cnpjPolicy) {
    return { aprovado: false, motivo: "CNPJ do emitente não autorizado pela apólice.", campo: "cnpj" };
  }

  // 2. Validação da data
  const dataTransporte = extractedData.dataTransporte;
  const inicioVigencia = POLICY_RULES.emitente.vigencia.inicio;
  const fimVigencia = POLICY_RULES.emitente.vigencia.fim;
  if (!isDateWithinPolicy(dataTransporte, inicioVigencia, fimVigencia)) {
    return { aprovado: false, motivo: "Data do transporte fora do período de vigência da apólice.", campo: "data" };
  }

  /*
  Preparação de dados para validação com IA:

  - Mercadoria {
      nome: extractedData.mercadoria.nome,
      valor: extractedData.mercadoria.valor
  }

  -> mapping de "RJ -> Rio de Janeiro" <-

  - Origem { 
      cidade: extractedData.origem.cidade,
      estado: extractedData.origem.estado
  }
  - Destino {
      cidade: extractedData.destino.cidade,
      estado: extractedData.destino.estado
  }
   

  - Dados do Embarcador: {
      nome: extractedData.emitente.nome,
      cnpj: extractedData.emitente.cnpj
  }

  -> arrumar apólice com dados do veículo transportador <-

  
  /*

  // 4. Validação bens e mercadorias excluídas

  // 5. Validação de regras

}
