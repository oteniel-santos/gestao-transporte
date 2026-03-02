import { InputHTMLAttributes, forwardRef } from "react";

interface InputFloatingProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  suggestions?: { id: string; nome: string; info?: string }[];
  onSelectSuggestion?: (suggestion: any) => void;
}

export const InputFloating = forwardRef<HTMLInputElement, InputFloatingProps>(
  function InputFloating(
    { label, error, suggestions, onSelectSuggestion, className = "", ...props },
    ref,
  ) {
    return (
      <div className="relative w-full">
        <input
          ref={ref}
          {...props}
          placeholder=" "
          autoComplete="off"
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

        {suggestions && suggestions.length > 0 && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
            {suggestions.map((s) => (
              <button
                key={s.id}
                type="button"
                onMouseDown={() => onSelectSuggestion?.(s)}
                className="w-full text-left px-4 py-2 hover:bg-indigo-50 transition border-b border-gray-100 last:border-0"
              >
                <div className="text-sm font-semibold text-gray-900 uppercase">
                  {s.nome}
                </div>
                {s.info && (
                  <div className="text-xs text-gray-500 mt-0.5">{s.info}</div>
                )}
              </button>
            ))}
          </div>
        )}

        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      </div>
    );
  },
);
