import { forwardRef } from 'react';

export const Input = forwardRef(({ className = '', error, label, ...props }, ref) => {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-gray-300 mb-1.5">{label}</label>}
      <input
        ref={ref}
        className={`w-full bg-glass border ${error ? 'border-red-500 focus:ring-red-500' : 'border-glassBorder focus:ring-primary focus:border-primary'} rounded-lg px-4 py-2.5 text-white placeholder-gray-500 transition-all focus:outline-none focus:ring-2 focus:ring-opacity-50 shadow-inner ${className}`}
        {...props}
      />
      {error && <p className="mt-1.5 text-sm text-red-400">{error.message}</p>}
    </div>
  );
});
Input.displayName = 'Input';
