import React from 'react';

export const SliderControl = ({
  label,
  value,
  min,
  max,
  step = 1,
  unit = '',
  onChange,
  disabled = false,
}) => {
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <span className="text-sm font-medium text-gray-900">
          {value}
          {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        disabled={disabled}
        className={`w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      />
      <div className="flex justify-between mt-1">
        <span className="text-xs text-gray-500">
          {min}
          {unit}
        </span>
        <span className="text-xs text-gray-500">
          {max}
          {unit}
        </span>
      </div>
    </div>
  );
};

export const ToggleControl = ({
  label,
  value,
  onChange,
  disabled = false,
  onLabel = 'On',
  offLabel = 'Off',
}) => {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <button
        type="button"
        className={`
          relative inline-flex h-6 w-11 items-center rounded-full
          ${value ? 'bg-green-600' : 'bg-gray-200'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        onClick={() => !disabled && onChange(!value)}
        disabled={disabled}
      >
        <span
          className={`
            inline-block h-4 w-4 transform rounded-full bg-white transition
            ${value ? 'translate-x-6' : 'translate-x-1'}
          `}
        />
        <span className="sr-only">{value ? onLabel : offLabel}</span>
      </button>
    </div>
  );
};

export const SelectControl = ({
  label,
  value,
  options,
  onChange,
  disabled = false,
}) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`
          block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm
          focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export const ActionButton = ({
  label,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  fullWidth = false,
  icon,
}) => {
  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    success: 'bg-green-600 hover:bg-green-700 text-white',
    warning: 'bg-amber-500 hover:bg-amber-600 text-white',
  };
  const sizeClasses = {
    sm: 'py-1 px-2 text-sm',
    md: 'py-2 px-4',
    lg: 'py-3 px-6 text-lg',
  };
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${fullWidth ? 'w-full' : ''}
        rounded-md font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${variant === 'primary' ? 'focus:ring-blue-500' : ''}
        ${variant === 'danger' ? 'focus:ring-red-500' : ''}
        ${variant === 'success' ? 'focus:ring-green-500' : ''}
        ${variant === 'warning' ? 'focus:ring-amber-500' : ''}
        flex items-center justify-center
      `}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {label}
    </button>
  );
};

const ControlPanel = ({ title, children }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <h3 className="text-lg font-medium text-gray-700 mb-4 border-b pb-2">
        {title}
      </h3>
      <div>{children}</div>
    </div>
  );
};

export default ControlPanel;
