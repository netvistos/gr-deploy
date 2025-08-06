'use client';

import { Button } from '@/components/Button';
import {
  CTE_SCHEMA,
  SECTION_TITLES,
  autoSaveCTeData,
  clearCTeDataFromStorage,
  loadCTeDataFromStorage,
  validateFieldWithMask, // ✨ NOVA FUNÇÃO
} from '@/lib/cte-schema';
import { applyMask, formatStoredValue, removeMask } from '@/lib/input-masks'; // ✨ IMPORTAR NOVA FUNÇÃO
import { useEffect, useState } from 'react';

export function ManualCTeForm({ onSubmit, isLoading, disabled }) {
  const [cteData, setCteData] = useState({});
  const [fieldErrors, setFieldErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [displayValues, setDisplayValues] = useState({}); // ✨ NOVO ESTADO PARA VALORES COM MÁSCARA

  // Carregar dados salvos ao montar o componente
  useEffect(() => {
    const savedData = loadCTeDataFromStorage();
    setCteData(savedData);

    // APLICAR MÁSCARAS AOS DADOS CARREGADOS (ATUALIZADO)
    const maskedData = {};
    Object.keys(savedData).forEach((sectionKey) => {
      if (savedData[sectionKey]) {
        maskedData[sectionKey] = {};
        Object.keys(savedData[sectionKey]).forEach((fieldKey) => {
          if (
            typeof savedData[sectionKey][fieldKey] === 'object' &&
            savedData[sectionKey][fieldKey] !== null
          ) {
            // Campo aninhado
            maskedData[sectionKey][fieldKey] = {};
            Object.keys(savedData[sectionKey][fieldKey]).forEach(
              (subFieldKey) => {
                const config =
                  CTE_SCHEMA[sectionKey]?.[fieldKey]?.[subFieldKey];
                const value = savedData[sectionKey][fieldKey][subFieldKey];

                // ✨ USAR NOVA FUNÇÃO PARA FORMATAR VALORES ARMAZENADOS
                maskedData[sectionKey][fieldKey][subFieldKey] = config?.mask
                  ? formatStoredValue(value, config.mask)
                  : value;
              }
            );
          } else {
            // Campo simples
            const config = CTE_SCHEMA[sectionKey]?.[fieldKey];
            const value = savedData[sectionKey][fieldKey];

            // ✨ USAR NOVA FUNÇÃO PARA FORMATAR VALORES ARMAZENADOS
            maskedData[sectionKey][fieldKey] = config?.mask
              ? formatStoredValue(value, config.mask)
              : value;
          }
        });
      }
    });
    setDisplayValues(maskedData);
  }, []);

  // Auto-save quando dados mudam
  useEffect(() => {
    if (Object.keys(cteData).length > 0) {
      autoSaveCTeData(cteData);
      validateForm();
    }
  }, [cteData]);

  // ✨ ATUALIZAR VALOR DE CAMPO COM NOVA LÓGICA MONETÁRIA
  const updateField = (sectionKey, fieldKey, value, subFieldKey = null) => {
    const config = subFieldKey
      ? CTE_SCHEMA[sectionKey]?.[fieldKey]?.[subFieldKey]
      : CTE_SCHEMA[sectionKey]?.[fieldKey];

    let maskedValue = value;
    let cleanValue = value;

    // ✨ LÓGICA ESPECIAL PARA CAMPOS MONETÁRIOS
    if (config?.mask === 'currency') {
      // Para currency, aplicamos a máscara diretamente no valor digitado
      maskedValue = applyMask(value, config.mask);
      cleanValue = removeMask(maskedValue, config.mask);
    } else if (config?.mask) {
      // Para outras máscaras, comportamento normal
      maskedValue = applyMask(value, config.mask);
      cleanValue = removeMask(maskedValue, config.mask);
    }

    // Atualizar valor de exibição (com máscara)
    setDisplayValues((prev) => {
      const newData = { ...prev };

      if (subFieldKey) {
        if (!newData[sectionKey]) newData[sectionKey] = {};
        if (!newData[sectionKey][fieldKey]) newData[sectionKey][fieldKey] = {};
        newData[sectionKey][fieldKey][subFieldKey] = maskedValue;
      } else {
        if (!newData[sectionKey]) newData[sectionKey] = {};
        newData[sectionKey][fieldKey] = maskedValue;
      }

      return newData;
    });

    // Atualizar valor limpo para armazenamento
    setCteData((prev) => {
      const newData = { ...prev };

      if (subFieldKey) {
        if (!newData[sectionKey]) newData[sectionKey] = {};
        if (!newData[sectionKey][fieldKey]) newData[sectionKey][fieldKey] = {};
        newData[sectionKey][fieldKey][subFieldKey] = cleanValue;
      } else {
        if (!newData[sectionKey]) newData[sectionKey] = {};
        newData[sectionKey][fieldKey] = cleanValue;
      }

      return newData;
    });

    // Validar campo em tempo real
    validateFieldRealTime(sectionKey, fieldKey, cleanValue, subFieldKey);
  };

  // ✨ VALIDAÇÃO EM TEMPO REAL ATUALIZADA
  const validateFieldRealTime = (
    sectionKey,
    fieldKey,
    value,
    subFieldKey = null
  ) => {
    const validation = validateFieldWithMask(
      sectionKey,
      fieldKey,
      value,
      subFieldKey
    );
    const fieldPath = subFieldKey
      ? `${sectionKey}.${fieldKey}.${subFieldKey}`
      : `${sectionKey}.${fieldKey}`;

    setFieldErrors((prev) => ({
      ...prev,
      [fieldPath]: validation.valid ? null : validation.message,
    }));
  };

  // Validar formulário completo
  const validateForm = () => {
    let hasErrors = false;
    const errors = {};

    Object.keys(CTE_SCHEMA).forEach((sectionKey) => {
      Object.keys(CTE_SCHEMA[sectionKey]).forEach((fieldKey) => {
        const fieldConfig = CTE_SCHEMA[sectionKey][fieldKey];

        if (!fieldConfig.type) {
          // Campo aninhado
          Object.keys(fieldConfig).forEach((subFieldKey) => {
            const value = cteData[sectionKey]?.[fieldKey]?.[subFieldKey] || '';
            const validation = validateFieldWithMask(
              sectionKey,
              fieldKey,
              value,
              subFieldKey
            );
            const fieldPath = `${sectionKey}.${fieldKey}.${subFieldKey}`;

            if (!validation.valid) {
              errors[fieldPath] = validation.message;
              hasErrors = true;
            }
          });
        } else {
          // Campo simples
          const value = cteData[sectionKey]?.[fieldKey] || '';
          const validation = validateFieldWithMask(sectionKey, fieldKey, value);
          const fieldPath = `${sectionKey}.${fieldKey}`;

          if (!validation.valid) {
            errors[fieldPath] = validation.message;
            hasErrors = true;
          }
        }
      });
    });

    setFieldErrors(errors);
    setIsFormValid(!hasErrors);
  };

  // Submit do formulário (usar dados limpos)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isFormValid && onSubmit) {
      onSubmit(cteData); // Envia dados limpos (sem máscara)
    }
  };

  // Limpar formulário
  const handleClear = () => {
    if (confirm('Deseja limpar todos os dados do formulário?')) {
      clearCTeDataFromStorage();
      setCteData({});
      setDisplayValues({}); // ✨ LIMPAR TAMBÉM OS VALORES DE EXIBIÇÃO
      setFieldErrors({});
    }
  };

  // ✨ RENDERIZAR CAMPO COM MÁSCARA
  const renderField = (
    sectionKey,
    fieldKey,
    fieldConfig,
    value = '',
    subFieldKey = null
  ) => {
    const fieldPath = subFieldKey
      ? `${sectionKey}.${fieldKey}.${subFieldKey}`
      : `${sectionKey}.${fieldKey}`;

    // Usar valor de exibição (com máscara)
    const displayValue = subFieldKey
      ? displayValues[sectionKey]?.[fieldKey]?.[subFieldKey] || ''
      : displayValues[sectionKey]?.[fieldKey] || '';

    const error = fieldErrors[fieldPath];
    const hasError = !!error;
    const isEmpty = !value || value.toString().trim() === '';
    const isValid = !hasError && !isEmpty;

    const getStatusIcon = () => {
      if (hasError) return '❌';
      if (isValid) return '✅';
      if (fieldConfig.required && isEmpty) return '⚠️';
      return '';
    };

    const inputProps = {
      id: fieldPath,
      value: displayValue, // ✨ USAR VALOR COM MÁSCARA
      placeholder: fieldConfig.placeholder,
      disabled: disabled || isLoading,
      maxLength: fieldConfig.maxLength, // ✨ LIMITAR TAMANHO SE DEFINIDO
      className: `w-full px-3 py-2 border rounded-md transition-colors ${
        hasError
          ? 'border-red-300 bg-red-50'
          : isValid
          ? 'border-green-300 bg-green-50'
          : 'border-gray-300'
      } focus:outline-none focus:ring-2 focus:ring-blue-500`,
      onChange: (e) =>
        updateField(sectionKey, fieldKey, e.target.value, subFieldKey),
    };

    return (
      <div key={fieldPath} className='space-y-1'>
        <label
          htmlFor={fieldPath}
          className='flex items-center space-x-2 text-sm font-medium text-gray-700'
        >
          <span>{fieldConfig.label}</span>
          {fieldConfig.required && <span className='text-red-500'>*</span>}
          <span className='text-lg'>{getStatusIcon()}</span>
          {/* ✨ INDICADOR DE MÁSCARA */}
          {fieldConfig.mask && (
            <span className='text-xs text-blue-600 bg-blue-100 px-1 rounded'>
              {fieldConfig.mask}
            </span>
          )}
        </label>

        {fieldConfig.type === 'select' ? (
          <select {...inputProps}>
            <option value=''>Selecione...</option>
            {fieldConfig.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        ) : fieldConfig.type === 'textarea' ? (
          <textarea {...inputProps} rows={3} />
        ) : (
          <input {...inputProps} type='text' /> // ✨ SEMPRE 'text' PARA PERMITIR MÁSCARAS
        )}

        {hasError && <p className='text-red-600 text-xs'>{error}</p>}
      </div>
    );
  };

  // Renderizar seção
  const renderSection = (sectionKey) => {
    const sectionConfig = CTE_SCHEMA[sectionKey];

    return (
      <div
        key={sectionKey}
        className='bg-white border rounded-lg p-4 space-y-4'
      >
        <h3 className='text-lg font-semibold text-gray-800 border-b pb-2'>
          {SECTION_TITLES[sectionKey]}
        </h3>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {Object.keys(sectionConfig).map((fieldKey) => {
            const fieldConfig = sectionConfig[fieldKey];

            if (!fieldConfig.type) {
              // Campo aninhado (origem/destino)
              return (
                <div key={fieldKey} className='md:col-span-2'>
                  <h4 className='font-medium text-gray-700 mb-2 capitalize'>
                    {fieldKey}
                  </h4>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    {Object.keys(fieldConfig).map((subFieldKey) =>
                      renderField(
                        sectionKey,
                        fieldKey,
                        fieldConfig[subFieldKey],
                        cteData[sectionKey]?.[fieldKey]?.[subFieldKey],
                        subFieldKey
                      )
                    )}
                  </div>
                </div>
              );
            }

            // Campo simples
            return renderField(
              sectionKey,
              fieldKey,
              fieldConfig,
              cteData[sectionKey]?.[fieldKey]
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      {/* Renderizar todas as seções */}
      {Object.keys(CTE_SCHEMA).map(renderSection)}

      {/* Botões de ação */}
      <div className='flex justify-between items-center pt-6 border-t'>
        <Button
          type='button'
          onClick={handleClear}
          disabled={disabled || isLoading}
          className='bg-gray-500 hover:bg-gray-600'
        >
          🗑️ Limpar Dados
        </Button>

        <div className='flex items-center space-x-4'>
          <span className='text-sm text-gray-600'>
            {isFormValid
              ? '✅ Formulário válido'
              : '⚠️ Preencha os campos obrigatórios'}
          </span>

          <Button
            type='submit'
            disabled={disabled || isLoading || !isFormValid}
            className='bg-blue-600 hover:bg-blue-700'
          >
            {isLoading ? '🤖 Validando...' : '🤖 Validar com IA'}
          </Button>
        </div>
      </div>
    </form>
  );
}
