type QuietCardProps = {
  onClose: () => void;
};

export default function QuietCard({ onClose }: QuietCardProps) {
  return (
    <div className="tm-quiet-overlay" onClick={onClose}>
      <div
        className="tm-quiet-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="tm-quiet-close"
          onClick={onClose}
          aria-label="Close Quiet Card"
        >
          ×
        </button>

        <div className="tm-quiet-brand">TRIMMUTE</div>

        <div className="tm-quiet-card">
          <div className="tm-quiet-icon">🤫</div>

          <h2>Quiet Cut</h2>

          <p className="tm-quiet-main">
            I'd prefer minimal conversation during my haircut today.
          </p>

          <p className="tm-quiet-sub">
            Please feel free to ask me anything necessary for my haircut.
            Otherwise, I'm happy to enjoy a quieter appointment.
          </p>
        </div>

        <p className="tm-quiet-hint">
          Simply show this screen to your barber.
        </p>
      </div>
    </div>
  );
}