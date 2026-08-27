import Modal from './Modal';
import { TIPS } from './tips';

const InstructionsModal = ({ isOpen, onClose }) => (
  <Modal isOpen={isOpen} onClose={onClose} title="How to Play">
    <ul className="instructions-list">
      {TIPS.map(tip => (
        <li key={tip.id}>
          <strong>{tip.title}.</strong> {tip.body}
        </li>
      ))}
    </ul>
  </Modal>
);

export default InstructionsModal;
