'use client';

import { FileUpload } from '@/components/FileUpload';
import { ManualCTeForm } from '@/components/ManualCTeForm';
import { TabView } from '@/components/TabView';
import { useState } from 'react';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [validationResult, setValidationResult] = useState(null);
  const [loadingStep, setLoadingStep] = useState('');
  const [activeTab, setActiveTab] = useState(0);

  // Função para validação (compartilhada entre XML e Manual)
  const validateWithAI = async (cteData, source = 'unknown') => {
    try {
      setLoadingStep('Validando com IA...');
      const validateResponse = await fetch('/api/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cteData }),
      });

      const validateData = await validateResponse.json();

      if (!validateResponse.ok) {
        throw new Error(validateData.error || 'Erro na validação');
      }

      setValidationResult(validateData);
      console.log(
        `Resultado da validação (${source}):`,
        validateData.validation
      );

      return validateData;
    } catch (err) {
      throw new Error(`Erro na validação: ${err.message}`);
    }
  };

  // Handler para Upload XML (Tab 1)
  const handleFileSelect = async (file) => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    setValidationResult(null);

    try {
      // ETAPA 1: Upload e Parse do XML
      setLoadingStep('Processando arquivo XML...');
      const formData = new FormData();
      formData.append('file', file);

      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const uploadData = await uploadResponse.json();

      if (!uploadResponse.ok) {
        throw new Error(uploadData.error || 'Erro no upload');
      }

      setResult(uploadData);
      console.log('Dados extraídos:', uploadData.data);

      // ETAPA 2: Validação com IA
      await validateWithAI(uploadData.data, 'XML');
    } catch (err) {
      setError(err.message);
      console.error('Erro:', err);
    } finally {
      setIsLoading(false);
      setLoadingStep('');
    }
  };

  // Handler para Formulário Manual (Tab 2)
  const handleManualSubmit = async (cteData) => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    setValidationResult(null);

    try {
      // Simular dados de upload para manter compatibilidade
      setResult({
        success: true,
        message: 'Dados configurados manualmente',
        data: cteData,
      });

      // Validação com IA
      await validateWithAI(cteData, 'Manual');
    } catch (err) {
      setError(err.message);
      console.error('Erro:', err);
    } finally {
      setIsLoading(false);
      setLoadingStep('');
    }
  };

  // Limpar resultados ao trocar de tab
  const handleTabChange = (tabIndex) => {
    setActiveTab(tabIndex);

    // Limpar estados ao trocar de tab
    if (!isLoading) {
      setError(null);
      setResult(null);
      setValidationResult(null);
    }
  };

  // Configuração das tabs
  const tabs = [
    {
      label: 'Upload XML',
      icon: '📁',
    },
    {
      label: 'Configurar Manual',
      icon: '📝',
    },
  ];

  return (
    <div className='min-h-screen bg-gray-50 flex items-center justify-center p-4'>
      <div className='w-full max-w-4xl space-y-6'>
        {/* Header */}
        <div className='text-center space-y-2'>
          <h1 className='text-3xl font-bold tracking-tight text-gray-900'>
            Validador CTe
          </h1>
          <p className='text-gray-600'>
            Validação de conformidade com apólice de seguro usando IA
          </p>
        </div>

        {/* Tabs Navigation and Content */}
        <div className='bg-white rounded-lg shadow-lg p-6'>
          <TabView
            tabs={tabs}
            defaultTab={activeTab}
            onTabChange={handleTabChange}
          >
            {/* Tab 1: Upload XML */}
            <div className='space-y-6'>
              <div className='text-center space-y-4'>
                <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
                  <h3 className='font-semibold text-blue-800'>
                    📁 Upload de Arquivo XML
                  </h3>
                  <p className='text-blue-700 text-sm mt-1'>
                    Carregue um arquivo CTe em formato XML para validação
                    automática
                  </p>
                </div>

                <FileUpload
                  onFileSelect={handleFileSelect}
                  accept='.xml'
                  disabled={isLoading}
                >
                  {isLoading ? loadingStep : 'Escolher arquivo XML'}
                </FileUpload>
              </div>
            </div>

            {/* Tab 2: Formulário Manual */}
            <div className='space-y-6'>
              <div className='bg-green-50 border border-green-200 rounded-lg p-4 mb-6'>
                <h3 className='font-semibold text-green-800'>
                  📝 Configuração Manual
                </h3>
                <p className='text-green-700 text-sm mt-1'>
                  Preencha os dados do CTe manualmente para validação
                </p>
              </div>

              <ManualCTeForm
                onSubmit={handleManualSubmit}
                isLoading={isLoading}
                disabled={isLoading}
              />
            </div>
          </TabView>
        </div>

        {/* Estados de Loading */}
        {isLoading && (
          <div className='bg-white rounded-lg shadow-lg p-6'>
            <div className='text-center text-blue-600 space-y-2'>
              <div className='animate-pulse text-2xl'>🤖 {loadingStep}</div>
              <div className='text-sm text-gray-500'>
                {loadingStep.includes('IA')
                  ? 'Analisando conformidade...'
                  : 'Extraindo dados...'}
              </div>
            </div>
          </div>
        )}

        {/* Erro */}
        {error && (
          <div className='bg-white rounded-lg shadow-lg p-6'>
            <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
              <div className='flex items-center space-x-2'>
                <span className='text-red-500 text-xl'>❌</span>
                <h3 className='font-semibold text-red-800'>Erro</h3>
              </div>
              <p className='text-red-700 text-sm mt-2'>{error}</p>
            </div>
          </div>
        )}

        {/* Resultado da Validação */}
        {validationResult && (
          <div className='bg-white rounded-lg shadow-lg p-6'>
            <div
              className={`border rounded-lg p-6 ${
                validationResult.validation.conforme
                  ? 'bg-green-50 border-green-200'
                  : 'bg-red-50 border-red-200'
              }`}
            >
              <div className='flex items-center space-x-2 mb-4'>
                <span className='text-2xl'>
                  {validationResult.validation.conforme ? '✅' : '❌'}
                </span>
                <h3
                  className={`text-lg font-bold ${
                    validationResult.validation.conforme
                      ? 'text-green-800'
                      : 'text-red-800'
                  }`}
                >
                  {validationResult.validation.conforme
                    ? 'CONFORME'
                    : 'NÃO CONFORME'}
                </h3>
                <span className='text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded'>
                  {activeTab === 0 ? 'XML' : 'Manual'}
                </span>
              </div>

              {/* Info do CTe */}
              <div className='mb-4 p-3 bg-white/50 rounded border'>
                <h4 className='font-medium text-gray-800 mb-2'>
                  📄 Informações do CTe
                </h4>
                <div className='text-sm text-gray-700 space-y-1'>
                  <p>
                    <strong>Emitente:</strong>{' '}
                    {validationResult.cteInfo.emitente}
                  </p>
                  <p>
                    <strong>Mercadoria:</strong>{' '}
                    {validationResult.cteInfo.mercadoria}
                  </p>
                  <p>
                    <strong>Valor:</strong> R${' '}
                    {validationResult.cteInfo.valor?.toLocaleString('pt-BR')}
                  </p>
                  <p>
                    <strong>Origem:</strong> {validationResult.cteInfo.origem}
                  </p>
                  <p>
                    <strong>Destino:</strong> {validationResult.cteInfo.destino}
                  </p>
                  <p>
                    <strong>Informações do Transporte:</strong>{' '}
                    {validationResult.cteInfo.informacoesTransporte}
                  </p>
                </div>
              </div>

              {/* Explicação da IA */}
              <div className='mb-4'>
                <h4 className='font-medium text-gray-800 mb-2'>
                  🧠 Análise da IA
                </h4>
                <p className='text-sm text-gray-700 leading-relaxed'>
                  {validationResult.validation.explicacao}
                </p>
              </div>

              {/* Violações (se houver) */}
              {validationResult.validation.violacoes?.length > 0 && (
                <div className='mb-4'>
                  <h4 className='font-medium text-red-800 mb-2'>
                    ⚠️ Violações Encontradas
                  </h4>
                  <ul className='text-sm text-red-700 space-y-1'>
                    {validationResult.validation.violacoes.map(
                      (violacao, index) => (
                        <li key={index} className='flex items-start space-x-2'>
                          <span>•</span>
                          <span>{violacao}</span>
                        </li>
                      )
                    )}
                  </ul>
                </div>
              )}

              {/* Riscos Identificados */}
              {(validationResult.validation.riscos?.riscoA?.length > 0 ||
                validationResult.validation.riscos?.riscoB?.length > 0) && (
                <div>
                  <h4 className='font-medium text-orange-800 mb-2'>
                    🎯 Riscos Identificados
                  </h4>
                  {validationResult.validation.riscos.riscoA?.length > 0 && (
                    <div className='mb-2'>
                      <p className='text-sm font-medium text-orange-700'>
                        Risco A:
                      </p>
                      <ul className='text-sm text-orange-600 ml-4'>
                        {validationResult.validation.riscos.riscoA.map(
                          (item, index) => (
                            <li key={index}>• {item}</li>
                          )
                        )}
                      </ul>
                    </div>
                  )}
                  {validationResult.validation.riscos.riscoB?.length > 0 && (
                    <div>
                      <p className='text-sm font-medium text-orange-700'>
                        Risco B:
                      </p>
                      <ul className='text-sm text-orange-600 ml-4'>
                        {validationResult.validation.riscos.riscoB.map(
                          (item, index) => (
                            <li key={index}>• {item}</li>
                          )
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
