# API Contracts - ia-gr

## Visão Geral

Este documento define os schemas completos de request/response para todas as APIs do sistema de validação CTe.

## POST /api/upload

### Request

```http
POST /api/upload
Content-Type: multipart/form-data

{
  file: <XML_FILE>  // chave obrigatória
}
```

### Response - Sucesso (200)

```json
{
  "success": true,
  "message": "Arquivo processado com sucesso",
  "data": {
    "issuer": {
      "cnpj": "13657062000112",
      "name": "LOGITIME TRANSPORTES LTDA"
    },
    "transport_date": "2025-07-15", // ISO format YYYY-MM-DD
    "shipper": {
      "cnpj": "98765432000198",
      "name": "MANN+HUMMEL"
    },
    "goods": {
      "name": "taco de beisebol",
      "value_brl": 2800000.0 // Number em BRL
    },
    "origin": {
      "city": "Rio de Janeiro",
      "uf": "RJ"
    },
    "destination": {
      "city": "São Paulo",
      "uf": "SP"
    }
  }
}
```

### Response - Erro (400)

```json
{
  "error": "Nenhum arquivo foi enviado"
}
```

```json
{
  "error": "Arquivo XML inválido ou não é um CTe"
}
```

### Response - Erro Interno (500)

```json
{
  "error": "Erro interno do servidor",
  "details": "<error_message>"
}
```

## POST /api/validate

### Request

```json
{
  "cteData": {
    "issuer": {
      "cnpj": "13657062000112",
      "name": "LOGITIME TRANSPORTES LTDA"
    },
    "transport_date": "2025-07-15",
    "shipper": {
      "cnpj": "98765432000198",
      "name": "MANN+HUMMEL"
    },
    "goods": {
      "name": "taco de beisebol",
      "value_brl": 2800000.0
    },
    "origin": {
      "city": "Rio de Janeiro",
      "uf": "RJ"
    },
    "destination": {
      "city": "São Paulo",
      "uf": "SP"
    }
  },
  "mode": "completa" // "completa" | "sequencial"
}
```

### Response - Sucesso (200)

```json
{
  "status": "reprovado", // "aprovado" | "atenção" | "reprovado" | "erro"
  "validation": [
    {
      "etapa": "CNPJ",
      "status": "aprovado",
      "motivo": "CNPJ do emitente autorizado pela apólice.",
      "cnpj_xml": "13657062000112",
      "cnpj_policy": "13657062000112"
    },
    {
      "etapa": "Data",
      "status": "aprovado",
      "motivo": "Data do transporte dentro do período de vigência da apólice.",
      "data_xml": "15/07/2025",
      "data_policy": "2024-10-19 a 2026-10-31"
    },
    {
      "etapa": "Bens e Mercadorias",
      "status": "reprovado",
      "motivo": "Mercadoria 'taco de beisebol' se enquadra como artigo esportivo.",
      "matched_rule_ids": ["excl-geral-001"]
    },
    {
      "etapa": "Gerenciamento de Risco",
      "status": "atenção",
      "motivo": "Ponto(s) de atenção identificado(s).",
      "matched_rule_ids": ["risk-shipper-mannhummel"],
      "obligations": [
        "análise de perfil profissional",
        "rastreamento / monitoramento de cargas"
      ],
      "bands_applied": [
        {
          "rule_id": "risk-shipper-mannhummel",
          "band_index": 3
        }
      ]
    },
    {
      "etapa": "LMG",
      "status": "aprovado",
      "motivo": "LMG calculado a partir das regras de risco aplicáveis.",
      "lmg_brl": 3000000.0,
      "lmg_sources": [
        {
          "rule_id": "risk-shipper-mannhummel",
          "last_band_max": 3000000.0
        }
      ]
    }
  ]
}
```

### Response - Erro Cliente (400)

```json
{
  "status": "erro",
  "motivo": "Dados do CTe são obrigatórios"
}
```

### Response - Erro Interno (500)

```json
{
  "status": "erro",
  "motivo": "<error_message>"
}
```

## Schemas OpenAI - Prompts Output

### Exclusions Stage

```json
{
  "stage": "BENS_EXCLUIDOS",
  "status": "aprovado" | "reprovado",
  "matched_rule_ids": ["excl-geral-001", "excl-rj-002"],
  "violations": [
    "Mercadoria 'taco de beisebol' se enquadra como artigo esportivo.",
    "Origem RJ não permitida para este tipo de mercadoria."
  ]
}
```

### Risk Management Stage

```json
{
  "stage": "GERENCIAMENTO_RISCO",
  "status": "aprovado" | "atenção",
  "matched_rule_ids": ["risk-A", "risk-shipper-mannhummel"],
  "obligations": [
    "análise de perfil profissional",
    "rastreamento / monitoramento de cargas",
    "acompanhamento de escolta armada e monitorada do início ao fim do risco"
  ],
  "bands_applied": [
    {
      "rule_id": "risk-A",
      "band_index": 2
    },
    {
      "rule_id": "risk-shipper-mannhummel",
      "band_index": 1
    }
  ]
}
```

## Tipos de Dados

### CTe Data Object

| Campo              | Tipo   | Obrigatório | Descrição               |
| ------------------ | ------ | ----------- | ----------------------- |
| `issuer.cnpj`      | string | ✅          | CNPJ do emitente        |
| `issuer.name`      | string | ✅          | Nome do emitente        |
| `transport_date`   | string | ✅          | Data ISO (YYYY-MM-DD)   |
| `shipper.cnpj`     | string | ✅          | CNPJ do embarcador      |
| `shipper.name`     | string | ✅          | Nome do embarcador      |
| `goods.name`       | string | ✅          | Descrição da mercadoria |
| `goods.value_brl`  | number | ✅          | Valor em BRL            |
| `origin.city`      | string | ✅          | Cidade de origem        |
| `origin.uf`        | string | ✅          | UF de origem            |
| `destination.city` | string | ✅          | Cidade de destino       |
| `destination.uf`   | string | ✅          | UF de destino           |

### Validation Result

| Campo              | Tipo     | Valores                                                               | Descrição                            |
| ------------------ | -------- | --------------------------------------------------------------------- | ------------------------------------ |
| `etapa`            | string   | "CNPJ", "Data", "Bens e Mercadorias", "Gerenciamento de Risco", "LMG" | Identificador da etapa               |
| `status`           | string   | "aprovado", "reprovado", "atenção", "erro"                            | Status da validação                  |
| `motivo`           | string   | -                                                                     | Explicação do resultado              |
| `matched_rule_ids` | string[] | -                                                                     | IDs das regras aplicáveis            |
| `obligations`      | string[] | -                                                                     | Obrigações aplicáveis (apenas risco) |
| `bands_applied`    | object[] | -                                                                     | Bandas aplicadas (apenas risco)      |
