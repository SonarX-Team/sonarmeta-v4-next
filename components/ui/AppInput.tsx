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
    <div>
      <div className="flex justify-between items-center text-small-regular mb-2">
        <label className="font-bold text-zinc-800">
          {label} {required && <span className="text-red-600">*</span>}
        </label>

        {errMsg && <label className="text-red-600">{errMsg}</label>}
      </div>

      <div
        className={`flex ${disabled ? "bg-zinc-700/90" : "bg-slate-300/30 hover:bg-slate-400/20"} ${
          errMsg ? "border-[1px] border-red-600" : "border-none"
        } rounded-md duration-200`}
      >
        <input
          className="flex-1 border-none outline-none bg-transparent py-2 mx-4"
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
