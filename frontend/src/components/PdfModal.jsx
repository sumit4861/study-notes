import { useEffect } from "react";
import { X, Download, ExternalLink, FileText } from "lucide-react";

function PdfModal({ isOpen, onClose, title, fileURL, downloadURL }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content modal-preview"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div className="modal-title">
            <FileText size={20} className="text-primary" />
            <span style={{ maxWidth: "450px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {title || "PDF Preview"}
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {downloadURL && (
              <a
                href={downloadURL}
                className="btn btn-secondary btn-sm"
                download
                title="Download PDF"
              >
                <Download size={15} />
                <span>Download</span>
              </a>
            )}

            <a
              href={fileURL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary btn-sm"
              title="Open full page in new tab"
            >
              <ExternalLink size={15} />
              <span>Full Tab</span>
            </a>

            <button
              type="button"
              className="modal-close-btn"
              onClick={onClose}
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div style={{ flex: 1, height: "100%", background: "#f8fafc" }}>
          <iframe
            src={fileURL}
            title={title}
            className="pdf-preview-frame"
          />
        </div>
      </div>
    </div>
  );
}

export default PdfModal;
