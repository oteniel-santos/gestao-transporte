import { InputHTMLAttributes } from "react";

interface InputFloatingProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function InputFloating({
  label,
  error,
  className = "",
  ...props
}: InputFloatingProps) {
  return (
    <div className="relative w-full">
      <input
        {...props}
        placeholder=" "
        className={`
          peer
          w-full
          uppercase
          rounded-md
          border
          bg-white
          px-3
          py-4
          text-sm
          text-gray-900
          focus:outline-none
          transition
          ${error ? "border-red-500" : "border-gray-300"}
          focus:border-indigo-500
          ${className}
        `}
      />

      <label
        className={`
          absolute
          left-3
          top-1/2
          -translate-y-1/2
          text-sm
          pointer-events-none
          transition-all
          bg-white
          px-1
          
          ${error ? "text-red-500" : "text-gray-500"}

          peer-focus:top-1
          peer-focus:text-xs
          peer-focus:text-indigo-600

          peer-not-placeholder-shown:top-1
          peer-not-placeholder-shown:text-xs
        `}
      >
        {label}
      </label>

      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
