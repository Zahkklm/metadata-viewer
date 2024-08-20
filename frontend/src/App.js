import React, { useState } from "react";
import axios from "axios";
import "./App.css";
import MetadataForm from "./components/MetadataForm";
import MetadataGrid from "./components/MetadataGrid";

// App component is the main entry point of the application
function App() {
  // State to manage URLs input by the user
  const [urls, setUrls] = useState(["", "", ""]);
  // State to manage metadata fetched from the server
  const [metadata, setMetadata] = useState([]);
  // State to manage loading state during data fetch
  const [loading, setLoading] = useState(false);
  // State to manage errors during data fetch
  const [error, setError] = useState(null);

  // Function to handle changes in URL input fields
  const handleChange = (index, value) => {
    const newUrls = [...urls];
    newUrls[index] = value;
    setUrls(newUrls);
  };

  // Function to handle form submission and fetch metadata
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null); // Reset error state
    setMetadata([]); // Clear previous metadata
    setLoading(true); // Set loading state to true

    try {
      // Make a POST request to fetch metadata
      const response = await axios.post(
        "http://localhost:5000/fetch-metadata",
        { urls },
      );
      setMetadata(response.data); // Update metadata state with response data
    } catch (err) {
      setError("Failed to fetch metadata. Please try again."); // Handle errors
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className="main-container">
      {/* Render MetadataForm component */}
      <MetadataForm
        urls={urls}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        error={error}
      />
      {/* Render MetadataGrid component */}
      <MetadataGrid metadata={metadata} loading={loading} />
    </div>
  );
}

export default App;
