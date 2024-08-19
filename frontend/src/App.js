import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [urls, setUrls] = useState(['', '', '']);
  const [metadata, setMetadata] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (index, value) => {
    const newUrls = [...urls];
    newUrls[index] = value;
    setUrls(newUrls);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setMetadata([]);
    setLoading(true);

    try {
      const response = await axios.post('https://localhost:5000/fetch-metadata', { urls });
      setMetadata(response.data);
    } catch (err) {
      setError('Failed to fetch metadata. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-container">
      <div className="metadata-form">
        <h1 className="title">Metadata Viewer</h1>
        <form onSubmit={handleSubmit}>
          {urls.map((url, index) => (
            <div key={index} className="input-wrapper">
              <input
                type="url"
                placeholder={`Enter URL ${index + 1}`}
                value={url}
                onChange={(e) => handleChange(index, e.target.value)}
                required
              />
            </div>
          ))}
          <button type="submit">Fetch Metadata</button>
        </form>
        {error && <div className="alert">{error}</div>}
      </div>

      <div className="card-output">
        {loading ? (
          <div className="loading">Loading...</div>
        ) : metadata.length > 0 ? (
          <div className="card-grid">
            {metadata.map((data, index) => (
              <div className="card" key={index}>
                <img src={data.image || 'https://via.placeholder.com/300x200'} alt={data.title || 'No title found'} />
                <h2>{data.title || 'No title found'}</h2>
                <p>{data.description || 'No description found'}</p>
                {data.error && <div className="alert">{data.error}</div>}
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default App;
