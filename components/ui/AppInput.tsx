type Props = {
  name: string;
  label: string;
  defaultValue?: string;
  placeholder: string;
  required?: boolean;
  disabled?: boolean;
  errMsg?: string;
  type?: "password" | "text";
};

const AppInput: React.FC<Props> = ({ name, label, defaultValue, placeholder, required, disabled, errMsg, type }) => {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center text-small-regular mb-2">
        <label className="font-bold text-zinc-200">
          {label} {required && <span className="text-red-400">*</span>}
        </label>

        {errMsg && <label className="text-red-400">{errMsg}</label>}
      </div>

      <div
        className={`flex ${disabled ? "bg-zinc-400/10" : "bg-white/10 hover:bg-zinc-400/10"} ${
          errMsg ? "border-[1px] border-red-400" : "border-none"
        } rounded-md duration-200`}
      >
        <input
          className="flex-1 border-none outline-none bg-transparent text-white py-2 mx-4"
          name={name}
          defaultValue={defaultValue}
          placeholder={placeholder}
          disabled={disabled}
          type={type === "password" ? type : "text"}
        />
      </div>
    </div>
  );
};

export default AppInput;
