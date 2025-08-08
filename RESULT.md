### RESULTADO DA VALIDAÇÃO

```
1 - cnpj: Validar se o CNPJ do CTe é o mesmo do CNPJ da apólice.

2 - vigencia: Validar se a vigência do CTe está dentro da vigência da apólice.

3 - mercadoria_excluida: Validar se a mercadoria do CTe está excluída da apólice. Se sim, seu status deve ser "reprovado" e você deve justificar o "motivo" com base na "regra" e "mercadoria" correspondente da apólice.

4 - regras_gerenciamento_de_riscos: Validar se as informações do CTe estão fora às regras de gerenciamento de riscos da apólice. Se sim, seu status deve ser "reprovado" e você deve justificar o "motivo" com base na condição/ regra que foi violada.

5 - clausula_especifica_de_exclusao: Validar se a clausula específica de exclusão do CTe está aplicável à apólice. Se sim, seu status deve ser "reprovado" e você deve justificar o "motivo" com base na condição/ regra que foi violada.

6 - limite_de_cobertura: Se as mercadoridas tiverem status "aprovado" nas regras 3, 4, 5: o valor padrão de garantia será de R$3.000.000,00 . Caso contrário, seu limite de cobertura será o valor informado na apólice a partir do seu enquadramento em regras_gerencia_de_riscos. Se sim, seu status deve ser "reprovado" e você deve justificar o "motivo" com base na condição/ regra que foi violada.
```

```json
cnpj: {
  "status": "aprovado|reprovado",
  "cnpj_cte": "00.000.000/0000-00",
  "cnpj_apolice": "00.000.000/0000-00",
}

vigencia: {
  "status": "aprovado|reprovado",
  "data_cte": "01/01/2021",
  "vigencia_apolice": "01/01/2021 - 01/01/2022",
}

mercadoria_excluida: {
  "status": true|false,
  "motivo": "N/A|motivo da exclusão"
}

regras_gerenciamento_de_riscos: {
  "status": true|false,
  "motivo": "N/A|motivo da exclusão"
}

clausula_especifica_de_exclusao: {
  "status": truefalse,
  "motivo": "N/A|motivo da exclusão"
}

limite_de_cobertura: {
  "status": false|true,
  "valor": "valor da regra|3.000.000,00"
}
```
