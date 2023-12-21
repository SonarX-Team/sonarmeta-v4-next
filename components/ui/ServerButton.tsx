type Props = {
  text: string;
  disabled?: boolean;
  type?: "submit" | "button";
  handleClick?: () => void;
};

const ServerButton: React.FC<Props> = ({ text, disabled, type, handleClick }) => {
  return (
    <button
      className="flex justify-center items-center w-full px-8 py-3 rounded-lg md:text-lg sm:text-base text-sm bg-violet-300 hover:bg-violet-200 duration-200 whitespace-nowrap"
      type={type}
      disabled={disabled}
      onClick={handleClick}
    >
      {text}
    </button>
  );
};

export default ServerButton;
