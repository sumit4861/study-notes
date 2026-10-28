import { useEffect } from "react";
import { AlertTriangle, X } from "lucide-react";

function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Delete",
  loading = false,
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && !loading) onClose();
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose, loading]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={() => !loading && onClose()}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "440px" }}
      >
        <div className="modal-header">
          <div className="modal-title" style={{ color: "var(--danger)" }}>
            <AlertTriangle size={20} />
            <span>{title}</span>
          </div>

          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            disabled={loading}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <p>{message}</p>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>

          <button
            type="button"
            className="btn btn-danger btn-sm"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "Deleting..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
