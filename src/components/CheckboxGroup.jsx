// src/components/CheckboxGroup.jsx
import clsx from 'clsx';

export default function CheckboxGroup({ name, register, label, options, error, defaultValues, ...props }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label}
      </label>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        {options.map((option) => (
          <div key={option.value}> {/* 'flex-1' a été retiré pour un meilleur rendu avec plusieurs lignes */}
            <input
              type="checkbox"
              id={`${name}-${option.value}`}
              value={option.value}
              className="sr-only peer"
              // Pour les checkboxes, on vérifie si la valeur est DANS le tableau des valeurs par défaut
              defaultChecked={defaultValues?.includes(option.value)}
              {...register(name)}
              {...props}
            />
            <label
              htmlFor={`${name}-${option.value}`}
              className={clsx(
                "w-full text-center px-4 py-2 rounded-lg border text-sm font-medium cursor-pointer transition-colors",
                "border-gray-300 bg-white text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300",
                "hover:bg-gray-50 dark:hover:bg-gray-700",
                "peer-checked:border-purple-500 peer-checked:bg-purple-50 peer-checked:text-purple-700",
                "dark:peer-checked:bg-purple-900/50 dark:peer-checked:border-purple-700 dark:peer-checked:text-purple-300"
              )}
            >
              {option.label}
            </label>
          </div>
        ))}
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error.message}</p>}
    </div>
  );
}