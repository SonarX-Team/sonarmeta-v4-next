import Image from "next/image";

type Props = {
  text: string;
  disabled?: boolean;
  pending?: boolean;
  type?: "submit" | "button";
  handleClick?: () => void;
};

const AppButton: React.FC<Props> = ({ text, disabled, pending, type, handleClick }) => {
  return (
    <button
      className="flex justify-center items-center w-full disabled:bg-zinc-600 disabled:text-zinc-50 bg-violet-300 hover:bg-violet-200 border-2 border-zinc-800 rounded-lg md:text-lg sm:text-base text-sm px-[30px] py-[10px] duration-200 btn-press"
      type={type}
      disabled={disabled}
      onClick={handleClick}
    >
      {pending && (
        <Image className="d-inline mr-1 animate-spin" src="/pending.png" alt="pending" width={20} height={20} />
      )}
      {text}
    </button>
  );
};

export default AppButton;
