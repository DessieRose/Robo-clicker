const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <h2>{title}</h2>
        {children}
        <button onClick={onClose}>Got it!</button>
      </div>
    </div>
  );
};

export default Modal;
