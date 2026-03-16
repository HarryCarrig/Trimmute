import { useState } from "react";

export default function CopySilentCutButton() {
  const [copied, setCopied] = useState(false);
  const textToCopy = "Requesting a Silent Cut please.";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      style={{
        padding: "8px 12px",
        borderRadius: "8px",
        border: "1px solid rgba(234, 179, 8, 0.35)",
        backgroundColor: copied ? "#16a34a" : "rgba(234, 179, 8, 0.12)",
        color: copied ? "#ffffff" : "#facc15",
        fontWeight: 600,
        cursor: "pointer",
        fontSize: "0.9rem",
        transition: "0.2s ease",
      }}
    >
      {copied ? "Copied!" : "Copy note"}
    </button>
  );
}