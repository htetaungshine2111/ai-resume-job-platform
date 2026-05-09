type Props = {
  title: string;

  onClose: () => void;

  children: React.ReactNode;
};

function Modal({ title, onClose, children }: Props) {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      onClick={(event) => event.stopPropagation()}
    >
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">{title}</h2>

          <button
            type="button"
            onClick={onClose}
            className="text-red-600 font-bold"
          >
            X
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}

export default Modal;
