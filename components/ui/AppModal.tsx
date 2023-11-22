export default function AppModal({
  isOpen,
  onClose,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const closeModal = () => {
    onClose();
  };

  return (
    <>
      {isOpen && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center">
          <div className="fixed top-0 left-0 w-full h-full bg-black opacity-50" onClick={closeModal}></div>
          <div className="relative bg-light-1 px-6 py-8 rounded-2xl max-w-[550px] min-w-[500px]">
            <button
              className="absolute top-4 right-6 text-zinc-700 hover:text-dark-1 head-text"
              onClick={closeModal}
            >
              &times;
            </button>
            {children}
          </div>
        </div>
      )}
    </>
  );
}
