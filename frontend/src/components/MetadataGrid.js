import React from "react";

// MetadataGrid component displays the fetched metadata or loading state
const MetadataGrid = ({ metadata, loading }) => (
  // data-testid here is to test is to identify whether this div will be rendered for testing purposes
  <div className="card-output" data-testid="card-output-success">
    {/* Display loading message if data is being fetched */}
    {loading ? (
      <div className="loading">Loading...</div>
    ) : metadata.length > 0 ? (
      <div className="card-grid">
        {/* Map over the metadata and display each entry */}
        {metadata.map((data, index) => (
          <div className="card" key={index}>
            {/* Display the image from metadata or a placeholder if not available */}
            <img
              src={data.image || "https://via.placeholder.com/300x200"}
              alt={data.title || "No title found"}
            />
            {/* Display the title from metadata or a fallback message */}
            <h2>{data.title || "No title found"}</h2>
            {/* Display the description from metadata or a fallback message */}
            <p>{data.description || "No description found"}</p>
            {/* Display an error message if there was an issue fetching metadata */}
            {data.error && <div className="alert">{data.error}</div>}
          </div>
        ))}
      </div>
    ) : null}
  </div>
);

export default MetadataGrid;
