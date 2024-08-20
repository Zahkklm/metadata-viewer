import React from "react";
import UrlInput from "./UrlInput";

// MetadataForm component renders the form for inputting URLs
const MetadataForm = ({ urls, handleChange, handleSubmit, error }) => (
  <div className="metadata-form">
    <h1 className="title">Metadata Viewer</h1>
    {/* Form to input URLs and submit to fetch metadata */}
    <form onSubmit={handleSubmit}>
      {/* Map over the URLs and render UrlInput components */}
      {urls.map((url, index) => (
        <UrlInput
          key={index}
          index={index}
          url={url}
          handleChange={handleChange}
        />
      ))}
      {/* Button to submit the form */}
      <button type="submit">Fetch Metadata</button>
    </form>
    {/* Display error message if any */}
    {error && <div className="alert">{error}</div>}
  </div>
);

export default MetadataForm;
