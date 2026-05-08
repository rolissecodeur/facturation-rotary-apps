import React from 'react';
// import PropTypes from 'prop-types';
import { twMerge } from 'tailwind-merge';

const Button = ({ children, icon, onClick, variant = 'solid', colorScheme = 'primary', className = '', ...props }) => {
  const baseStyles = 'inline-flex items-center justify-center gap-2 px-4 h-9 text-sm font-semibold rounded-md transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-offset-2 dark:focus:ring-offset-gray-800 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-px active:translate-y-0';
  const styles = {
    solid: {
      primary: 'text-white bg-green-600 hover:bg-green-700 focus:ring-green-500',
      success: 'text-white bg-green-600 hover:bg-green-700 focus:ring-green-500',
      info: 'text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
      whatsapp: 'text-white bg-[#25D366] hover:bg-[#128C7E] focus:ring-green-500',
    },
    destructive: {
      solid: 'text-white bg-red-600 hover:bg-red-700 focus:ring-red-500',
      ghost: 'text-red-600 hover:bg-red-100 dark:hover:bg-red-900/50 focus:ring-red-500',
    },
    ghost: {
      primary: 'text-gray-700 dark:text-gray-300 bg-transparent hover:bg-gray-200 dark:hover:bg-gray-700 focus:ring-green-500',
    }
  };
  let variantStyle;
  if (variant === 'destructive') {
    variantStyle = styles.destructive.solid;
  } else if (variant === 'destructive-ghost') {
    variantStyle = styles.destructive.ghost;
  } else {
    variantStyle = styles[variant][colorScheme];
  }
  const finalClassName = twMerge(baseStyles, variantStyle, className);
  return (
    <button className={finalClassName} onClick={onClick} {...props}>
      {icon && React.cloneElement(icon, { size: 16, className: 'shrink-0' })}
      {children && <span>{children}</span>}
    </button>
  );
};
// Button.propTypes = {
//   children: PropTypes.node,
//   onClick: PropTypes.func,
//   icon: PropTypes.element,
//   variant: PropTypes.oneOf(['solid', 'destructive', 'ghost', 'destructive-ghost']),
//   colorScheme: PropTypes.oneOf(['primary', 'success', 'info', 'whatsapp']),
//   className: PropTypes.string,
// };
export default Button;