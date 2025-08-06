import * as React from 'react';

const Button = React.forwardRef(
  (
    {
      className = '',
      variant = 'default',
      size = 'default',
      children,
      ...props
    },
    ref
  ) => {
    const baseClasses =
      'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';

    const variants = {
      default: 'bg-blue-600 text-white hover:bg-blue-700',
      outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50',
      secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
    };

    const sizes = {
      default: 'h-10 px-4 py-2',
      lg: 'h-12 px-6 py-3 text-base',
      sm: 'h-8 px-3 py-1 text-sm',
    };

    const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;

    return (
      <button ref={ref} className={classes} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
