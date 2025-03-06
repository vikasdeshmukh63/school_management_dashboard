import { FieldError } from 'react-hook-form';

// input field props
type InputFieldProps = {
  label: string;
  type?: string;
  register: any;
  name: string;
  defaultValue?: string;
  error?: FieldError;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  hidden?: boolean;
  min?: number;
  max?: number;
};

// input field component
const InputField = ({
  label,
  type = 'text',
  register,
  name,
  defaultValue,
  error,
  inputProps,
  hidden = false,
  min,
  max,
}: InputFieldProps) => {
  return (
    <div className={hidden ? 'hidden' : 'flex flex-col gap-2 w-full md:w-1/4'}>
      {/* label */}
      <label className="text-xs text-gray-500">{label}</label>
      {/* input */}
      <input
        type={type}
        {...register(name)}
        className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
        {...inputProps}
        defaultValue={defaultValue}
        hidden={hidden}
        min={min}
        max={max}
      />
      {/* error */}
      {error?.message && <p className="text-xs text-red-400">{error.message.toString()}</p>}
    </div>
  );
};

export default InputField;
