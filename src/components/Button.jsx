/**
 * A reusable Button component with different visual styles.
 *
 * This component abstracts the Tailwind CSS classes for buttons, providing a
 * consistent look and feel across the application. It supports multiple
 * variants and can be extended with additional classes. You understand.
 *
 * @param {object} props - The component props.
 * @param {'primary' | 'secondary' | 'danger' | 'link' | 'icon' | 'floating'} [props.variant='primary'] - The button style variant.
 * @param {'sm' | 'md' | 'lg' | 'icon'} [props.size='md'] - The button size variant.
 * @param {React.ReactNode} props.children - The content of the button.
 * @param {string} [props.className=''] - Additional CSS classes to apply.
 */
export function Button({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  ...props
}) {
  const baseStyles =
    'font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center';

  const variants = {
    primary: 'bg-emerald-600 text-white hover:bg-emerald-700 rounded-xl',
    secondary: 'bg-slate-200 text-slate-800 hover:bg-slate-300 rounded-xl',
    danger: 'bg-red-600 text-white hover:bg-red-700 rounded-xl',
    link: 'text-emerald-600 hover:underline',
    icon: 'text-slate-500 hover:text-red-600',
    floating: 'bg-emerald-600 text-white hover:bg-emerald-700 rounded-full shadow-lg transition-transform transform hover:scale-110'
  };

  const sizes = {
    sm: 'p-1',
    md: 'py-2 px-4',
    lg: 'py-3 px-6 text-lg',
    icon: 'w-8 h-8',
  };

  const combinedClassName = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

  return (
    <button className={combinedClassName} {...props}>
      {children}
    </button>
  );
}
