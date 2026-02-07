import React, { useState } from "react";

const PinCard = ({
  pin,
  onEdit,
  onDelete,
  getImageUrl,
  onSelectExtension,
  verifiedExtension,
}) => {
  const [copyPromptSuccess, setCopyPromptSuccess] = useState(false);
  const [copyFileSuccess, setCopyFileSuccess] = useState(false);

  const handleCopyPrompt = () => {
    if (pin.imagePrompt) {
      navigator.clipboard.writeText(pin.imagePrompt);
      setCopyPromptSuccess(true);
      setTimeout(() => setCopyPromptSuccess(false), 2001);
    }
  };

  const handleCopyFilename = () => {
    if (pin.filename) {
      navigator.clipboard.writeText(pin.filename);
      setCopyFileSuccess(true);
      setTimeout(() => setCopyFileSuccess(false), 2000);
    }
  };

  return (
    <div className="pin-card animate-fade-in">
      <div
        className={`pin-image-wrapper ${!verifiedExtension ? "split-view" : ""}`}
      >
        {!verifiedExtension ? (
          <>
            <div
              className="split-half png"
              onClick={() => onSelectExtension(pin.id, ".png")}
            >
              <img
                src={getImageUrl(pin, ".png")}
                alt="PNG version"
                loading="lazy"
              />
              <div className="extension-badge">PNG</div>
            </div>
            <div
              className="split-half jpg"
              onClick={() => onSelectExtension(pin.id, ".jpg")}
            >
              <img
                src={getImageUrl(pin, ".jpg")}
                alt="JPG version"
                loading="lazy"
              />
              <div className="extension-badge">JPG</div>
            </div>
            <div className="split-overlay-text">Click to verify extension</div>
          </>
        ) : (
          <>
            <img
              src={getImageUrl(pin)}
              alt={pin.title}
              className="pin-image"
              loading="lazy"
            />
            <button
              className="reset-extension-btn"
              onClick={(e) => {
                e.stopPropagation();
                onSelectExtension(pin.id, null);
              }}
              title="Reset Extension"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
              >
                <path d="M20 11a8.1 8.1 0 0 0-15.5-2m-.5-4v4h4" />
                <path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4" />
              </svg>
            </button>
            <div className="extension-verified-badge">
              {verifiedExtension.replace(".", "").toUpperCase()}
            </div>
          </>
        )}
      </div>
      <div className="pin-info">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "0.75rem",
          }}
        >
          <span className="board-badge">{pin.board}</span>
          <span
            style={{
              fontSize: "0.7rem",
              color: "var(--text-muted)",
              display: "flex",
              alignItems: "center",
              gap: "0.3rem",
            }}
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
            </svg>
            {pin.publishDate
              ? new Date(pin.publishDate).toLocaleDateString()
              : "No date"}
          </span>
        </div>

        <h3
          className="pin-title"
          style={{
            fontSize: "1.1rem",
            marginBottom: "1.25rem",
            minHeight: "2.8rem",
          }}
        >
          {pin.title}
        </h3>

        <div
          className="card-actions"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "0.5rem",
          }}
        >
          <button
            className="action-btn"
            onClick={() => onEdit(pin)}
            title="Edit Pin"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
            Edit
          </button>

          <button
            className="action-btn delete"
            onClick={() => onDelete(pin.id)}
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
            Delete
          </button>

          <button
            className="action-btn"
            onClick={handleCopyFilename}
            style={{ color: copyFileSuccess ? "#10b981" : "inherit" }}
            title="Copy Filename"
          >
            {copyFileSuccess ? (
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            ) : (
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                <polyline points="13 2 13 9 20 9"></polyline>
              </svg>
            )}
            {copyFileSuccess ? "Done" : "File Name"}
          </button>

          <button
            className="action-btn"
            onClick={handleCopyPrompt}
            style={{ color: copyPromptSuccess ? "#10b981" : "inherit" }}
            title="Copy Image Prompt"
          >
            {copyPromptSuccess ? (
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            ) : (
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
            )}
            {copyPromptSuccess ? "Done" : "Prompt"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PinCard;
