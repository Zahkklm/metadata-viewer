import React from "react";

// UrlInput component renders a single input field for a URL
const UrlInput = ({ index, url, handleChange }) => (
  <div className="input-wrapper">
    {/* Input field for entering the URL */}
    <input
      type="url"
      placeholder={`Enter URL ${index + 1}`}
      value={url}
      onChange={(e) => handleChange(index, e.target.value)}
      required
    />
  </div>
);

export default UrlInput;
