import { SelectHTMLAttributes } from "react";

type Option = {
  value: number;
  label: string;
};

type Props = SelectHTMLAttributes<HTMLSelectElement> & {
  name: string;
  label: string;
  placeholder: string;
  options: Option[];
  disabled?: boolean;
  errMsg?: string;
};

const AppSelect: React.FC<Props> = ({ name, label, placeholder, options, disabled, errMsg, ...selectProps }) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <label className="font-bold text-zinc-800">{label}</label>

        {errMsg && <label className="text-small-regular text-red-600">{errMsg}</label>}
      </div>

      <div
        className={`flex border-[1px] ${disabled ? "bg-zinc-700/90" : "bg-transparent"} ${
          errMsg ? "border-red-600" : "border-zinc-300 hover:border-zinc-500"
        } rounded-md duration-200`}
      >
        <select
          className="flex-1 border-none outline-none bg-transparent py-2 mx-4"
          name={name}
          placeholder={placeholder}
          disabled={disabled}
          {...selectProps}
        >
          {options.map((option) => (
            <option className="line-clamp-1" key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default AppSelect;
