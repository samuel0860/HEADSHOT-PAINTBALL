import { forwardRef } from 'react';
import { phoneMask } from '../../utils/formatters';

export const FormField = forwardRef(function FormField(
  { label, error, type = 'text', required, hint, mask, className = '', ...props },
  ref
) {
  const handleChange = (e) => {
    if (!props.onChange) return;
    let val = e.target.value;
    if (mask === 'phone') val = phoneMask(val);
    props.onChange({ ...e, target: { ...e.target, value: val } });
  };

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label className="block text-sm font-semibold text-[#f1f5f9]">
          {label}
          {required && <span className="text-[#e85c0d] ml-1">*</span>}
        </label>
      )}
      {type === 'textarea' ? (
        <textarea
          ref={ref}
          {...props}
          onChange={handleChange}
          className={`input-field resize-none ${error ? 'error' : ''}`}
          rows={props.rows || 4}
        />
      ) : type === 'select' ? (
        <select
          ref={ref}
          {...props}
          className={`input-field ${error ? 'error' : ''}`}
          style={{ backgroundImage: 'none' }}
        >
          {props.children}
        </select>
      ) : (
        <input
          ref={ref}
          type={type}
          {...props}
          onChange={handleChange}
          className={`input-field ${error ? 'error' : ''}`}
        />
      )}
      {hint && !error && <p className="text-xs text-[#64748b]">{hint}</p>}
      {error && <p className="text-xs text-[#dc2626] flex items-center gap-1">⚠ {error}</p>}
    </div>
  );
});
