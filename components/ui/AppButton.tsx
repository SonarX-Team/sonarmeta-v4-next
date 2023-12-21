// @ts-ignore
import { useFormStatus } from "react-dom";

type Props = {
  text: string;
  otherPendingStatus?: boolean;
  pendingText?: string;
  disabled?: boolean;
  type?: "submit" | "button";
  handleClick?: () => void;
};

const AppButton: React.FC<Props> = ({ text, otherPendingStatus, pendingText, disabled, type, handleClick }) => {
  const { pending } = useFormStatus();

  return (
    <button
      className="flex justify-center items-center w-full disabled:bg-zinc-600 disabled:text-zinc-50 bg-violet-300 hover:bg-violet-200 rounded-lg md:text-lg sm:text-base text-sm px-8 py-3 duration-200 whitespace-nowrap"
      type={type}
      disabled={disabled || pending || otherPendingStatus}
      onClick={handleClick}
    >
      {(pending || otherPendingStatus) && (
        <img className="d-inline w-[20px] h-[20px] mr-1 animate-spin" src="/pending.png" alt="pending" />
      )}
      {pending || otherPendingStatus ? pendingText : text}
    </button>
  );
};

export default AppButton;
