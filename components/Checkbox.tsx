import React from 'react';
import { Check } from 'lucide-react';

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  containerClassName?: string;
  labelClassName?: string;
  children?: React.ReactNode;
}

const Checkbox: React.FC<CheckboxProps> = ({
  containerClassName = '',
  labelClassName = '',
  children,
  ...props
}) => {
  return (
    <label className={`inline-flex items-center ${containerClassName}`}>
      <input type="checkbox" className="sr-only peer" {...props} />
      <span className="h-4 w-4 rounded border border-brand-300 bg-white flex items-center justify-center peer-checked:bg-accent-600 peer-checked:border-accent-600 peer-focus:ring-2 peer-focus:ring-accent-500 peer-focus:ring-offset-2 transition-colors">
        <Check className="h-3 w-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
      </span>
      {children && <span className={`ml-2 ${labelClassName}`}>{children}</span>}
    </label>
  );
};

export default Checkbox;
