export interface SelectProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  required?: boolean;
  placeholder?: string;
}

export function SelectField({ label, value, onChange, options, required, placeholder }: SelectProps) {
  return (
    <label className="flex flex-col gap-1 text-sm font-semibold text-slate-700">
      {label}
      {required ? <span className="text-xs text-red-500">*</span> : null}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm font-normal shadow-sm focus:border-brand-600 focus:outline-none"
      >
        <option value="">{placeholder || `Select ${(label || '').toLowerCase()}`}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

export interface TextFieldProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
}

export function TextField({ label, value, onChange, type = 'text', required, placeholder }: TextFieldProps) {
  return (
    <label className="flex flex-col gap-1 text-sm font-semibold text-slate-700">
      {label}
      {required ? <span className="text-xs text-red-500">*</span> : null}
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm font-normal shadow-sm focus:border-brand-600 focus:outline-none"
      />
    </label>
  );
}
