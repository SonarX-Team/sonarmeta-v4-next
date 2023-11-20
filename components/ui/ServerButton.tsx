type Props = {
  text: string;
  disabled?: boolean;
  type?: "submit" | "button";
  handleClick?: () => void;
};

const ServerButton: React.FC<Props> = ({ text, disabled, type, handleClick }) => {
  return (
    <button
      className="flex justify-center items-center w-full disabled:bg-zinc-600 disabled:text-zinc-50 bg-violet-300 hover:bg-violet-200 border-2 disabled:border-zinc-800 border-zinc-600 rounded-lg md:text-lg sm:text-base text-sm px-[30px] py-[10px] duration-200 whitespace-nowrap btn-press"
      type={type}
      disabled={disabled}
      onClick={handleClick}
    >
      {text}
    </button>
  );
};

export default ServerButton;
