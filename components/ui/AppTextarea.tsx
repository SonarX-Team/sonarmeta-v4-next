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
    <div className="mb-6">
      <div className="flex justify-between items-center text-small-regular mb-2">
        <label className="font-bold text-zinc-200">
          {label} {required && <span className="text-red-400">*</span>}
        </label>

        {errMsg && <label className="text-red-400 err-message">{errMsg}</label>}
      </div>

      <div
        className={`flex ${disabled ? "bg-zinc-400/10" : "bg-white/10 hover:bg-zinc-400/10"} ${
          errMsg ? "border-[1px] border-red-400" : "border-none"
        } rounded-lg duration-200`}
      >
        <textarea
          className="flex-1 border-none outline-none resize-none bg-transparent text-white placeholder:text-zinc-400 py-2 mx-4"
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
