'use client';

import * as React from 'react';
import { Button } from './Button';

const FileUpload = React.forwardRef(
  (
    {
      className = '',
      onFileSelect,
      accept = '.xml',
      children = 'Selecionar arquivo XML',
      disabled = false,
      ...props
    },
    ref
  ) => {
    const fileInputRef = React.useRef(null);

    const handleButtonClick = () => {
      if (disabled) return;
      fileInputRef.current?.click();
    };

    const handleFileChange = (event) => {
      const file = event.target.files?.[0];
      if (file && onFileSelect && !disabled) {
        onFileSelect(file);
        // 🔧 CORREÇÃO: Limpar o input após seleção
        event.target.value = '';
      }
    };

    return (
      <div className={`flex flex-col gap-2 ${className}`} {...props}>
        <Button
          onClick={handleButtonClick}
          variant='outline'
          size='lg'
          className='w-full'
          disabled={disabled}
        >
          {children}
        </Button>

        <input
          ref={fileInputRef}
          type='file'
          accept={accept}
          onChange={handleFileChange}
          className='hidden'
          disabled={disabled}
        />
      </div>
    );
  }
);

FileUpload.displayName = 'FileUpload';

export { FileUpload };
