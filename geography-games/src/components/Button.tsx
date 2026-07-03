import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'light';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', children, className = '', ...props }) => {
  const variantClass = variant === 'primary' ? '' : variant;
  return (
    <button className={`neobrutal-btn ${variantClass} ${className}`.trim()} {...props}>
      {children}
    </button>
  );
};
