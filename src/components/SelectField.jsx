import { forwardRef } from "react";
import clsx from "clsx";

const SelectField = forwardRef(({ id, label, options = [], placeholder, error, valueKey = 'value', ...props }, ref) => {
  
  const selectClasses = clsx(
    "mt-1 block w-full rounded-md h-10 sm:text-sm px-3 border appearance-none",
    "dark:bg-gray-700 dark:text-white",
    {
      "border-gray-300 focus:border-purple-300 focus:ring focus:ring-purple-200 focus:ring-opacity-50 outline-none": !error,
      "border-red-500 focus:border-red-500 focus:ring focus:ring-red-200 focus:ring-opacity-50 outline-none": error,
    }
  );

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          ref={ref}
          {...props}
          className={selectClasses}
          defaultValue="" 
        >
          <option value="" disabled>
            {placeholder || 'Sélectionnez une option...'}
          </option>

          {options.map((option) => (
            <option key={option.value} value={option[valueKey]}>
              {option.label}
            </option>
          ))}
        </select>
        
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        </div>
      </div>
      
      {error && <p className="mt-1 text-sm text-red-500">{error.message}</p>}
    </div>
  );
});

SelectField.displayName = "SelectField";

export default SelectField;