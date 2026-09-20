import React, { useId } from 'react';

const Textarea = React.forwardRef(({
  label,
  error,
  helperText,
  id: customId,
  rows = 4,
  className = '',
  required = false,
  fullWidth = true,
  ...props
}, ref) => {
  const generatedId = useId();
  const id = customId || generatedId;

  return (
    <div className={`flex flex-col gap-1.5 ${fullWidth ? 'w-full' : ''}`}>
      {label && (
        <label htmlFor={id} className="text-sm font-semibold text-[#1b2437] flex items-center gap-1">
          {label}
          {required && <span className="text-[#b91c1c]">*</span>}
        </label>
      )}

      <textarea
        ref={ref}
        id={id}
        rows={rows}
        required={required}
        className={`w-full px-3.5 py-2.5 bg-white border ${
          error ? 'border-[#b91c1c] focus:ring-[#b91c1c]' : 'border-[#e6e1d6] focus:border-[#0a1f44] focus:ring-[#0a1f44]'
        } rounded-lg text-sm text-[#1b2437] placeholder:text-[#9ca3af] outline-none transition-all duration-150 focus:ring-2 focus:ring-opacity-20 resize-y disabled:bg-[#f3f4f6] disabled:cursor-not-allowed ${className}`}
        {...props}
      />

      {error && <p className="text-xs text-[#b91c1c] font-medium">{error}</p>}
      {!error && helperText && <p className="text-xs text-[#6b7280]">{helperText}</p>}
    </div>
  );
});

Textarea.displayName = 'Textarea';

export default Textarea;
