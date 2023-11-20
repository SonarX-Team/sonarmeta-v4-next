type Props = {
  name: string;
  label: string;
  defaultValue?: string;
  placeholder: string;
  rows: number;
  required?: boolean;
  disabled?: boolean;
  errMsg?: string;
};

const AppTextarea: React.FC<Props> = ({ name, label, defaultValue, placeholder, rows, required, disabled, errMsg }) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <label className="font-bold text-zinc-800">
          {label} {required && <span className="text-red-600">*</span>}
        </label>

        {errMsg && <label className="text-small-regular text-red-600">{errMsg}</label>}
      </div>

      <div
        className={`flex border-[1px] ${disabled ? "bg-zinc-200" : "bg-transparent"} ${
          errMsg ? "border-red-600" : "border-zinc-300 hover:border-zinc-500"
        } rounded-lg duration-200`}
      >
        <textarea
          className="flex-1 border-none outline-none resize-none bg-transparent py-2 mx-4"
          name={name}
          defaultValue={defaultValue}
          placeholder={placeholder}
          rows={rows}
          disabled={disabled}
        />
      </div>
    </div>
  );
};

export default AppTextarea;
