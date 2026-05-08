import { forwardRef } from "react";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

const InputField = forwardRef(({ 
  id, 
  label, 
  type = "text", 
  error, 
  icon: Icon, // Récupération de l'icône (renommée en Icon pour l'utiliser comme composant)
  labelClassName, 
  inputClassName, 
  ...props 
}, ref) => {

  const finalInputClasses = twMerge(
    clsx(
      "mt-1 block w-full rounded-lg h-11 sm:text-sm border transition-all duration-200",
      "text-gray-900 dark:text-white bg-white dark:bg-gray-800",
      "placeholder:text-gray-400",
      {
        // Si une icône est présente, on met plus de padding à gauche (pl-10), sinon padding normal (px-4)
        "pl-10 pr-4": Icon,
        "px-4": !Icon,
        
        // États de bordure
        "border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none": !error,
        "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none": error,
      }
    ),
    inputClassName 
  );

  const finalLabelClasses = twMerge(
    "block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1.5",
    labelClassName
  );

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className={finalLabelClasses}>
          {label}
        </label>
      )}
      
      {/* Conteneur relatif pour positionner l'icône */}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
        )}
        
        <input
          id={id}
          type={type}
          ref={ref}
          {...props}
          className={finalInputClasses}
        />
      </div>

      {error && <p className="mt-1.5 text-xs font-medium text-red-500">{error.message}</p>}
    </div>
  );
});

InputField.displayName = "InputField";
export default InputField;