import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

const PasswordInput = React.forwardRef(({ 
  id, 
  label, 
  error, 
  disabled,
  icon: Icon,
  labelClassName, 
  inputClassName, 
  ...rest 
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);

  const toggleVisibility = () => {
    if (!disabled) {
      setShowPassword(prevState => !prevState);
    }
  };

  const finalInputClasses = twMerge(
    "block w-full h-14 rounded-xl border border-gray-100 bg-gray-50 text-gray-900 focus:bg-white focus:border-[#f97316] outline-none transition-all sm:text-sm disabled:cursor-not-allowed disabled:opacity-50 placeholder:text-gray-400",
    Icon ? "pl-10" : "pl-4",
    "pr-10",
    error && "border-red-500 focus:border-red-500",
    inputClassName
  );

  const finalLabelClasses = twMerge(
    "text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block",
    labelClassName
  );

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className={finalLabelClasses}>
          {label}
        </label>
      )}

      <div className="relative">
        
        {/* Icône gauche */}
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-gray-400" />
          </div>
        )}

        <input
          id={id}
          type={showPassword ? 'text' : 'password'}
          ref={ref}
          disabled={disabled}
          className={finalInputClasses}
          {...rest}
        />

        {/* Bouton Eye */}
        <button
          type="button"
          onClick={toggleVisibility}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-[#f97316] transition-colors focus:outline-none"
          tabIndex={-1}
          disabled={disabled}
        >
          {showPassword 
            ? <EyeOff className="h-5 w-5" /> 
            : <Eye className="h-5 w-5" />
          }
        </button>
      </div>

      {error && (
        <p className="mt-1.5 text-xs font-medium text-red-500">
          {error.message}
        </p>
      )}
    </div>
  );
});

PasswordInput.displayName = 'PasswordInput'; 

export default PasswordInput;