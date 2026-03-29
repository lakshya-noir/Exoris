import React, { useState } from "react";
import "../styles/components.css";
import ImageModal from "./ImageModal"; // You need to create this component as described

export default function SearchBar({ placeholder }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImageUrl, setModalImageUrl] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/search/nasa/?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      const images = Array.isArray(data) ? data : data.results || [];
      setResults(images);
    } catch (err) {
      console.error("Search failed", err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setQuery("");
    setResults([]);
  };

  const handleImageClick = (url) => {
    setModalImageUrl(url);
    setModalOpen(true);
  };

  return (
    <div className="search-container">
      <form onSubmit={handleSearch}>
        <input
          className="search-input"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button className="search-button" type="submit">
          Search
        </button>
        {results.length > 0 && (
          <button
            type="button"
            className="search-button"
            style={{ marginLeft: "12px" }}
            onClick={handleClear}
          >
            Clear Search
          </button>
        )}
      </form>

      {loading && <p className="loading-text">Loading...</p>}

      {results.length > 0 && (
        <div className="results-background">
          <div className="image-grid">
            {results.map((item) => (
              <div
                key={item.nasa_id}
                className="image-card"
                onClick={() => handleImageClick(item.image_url || item.thumbnail_url)}
                style={{ cursor: "zoom-in" }}
              >
                <img
                  src={item.thumbnail_url || item.image_url}
                  alt={item.title}
                  className="grid-image"
                />
                <div className="image-info">
                  <h4>{item.title}</h4>
                  <p>
                    {item.description && item.description.length > 150
                      ? item.description.slice(0, 150) + "..."
                      : item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <ImageModal
        isOpen={modalOpen}
        onRequestClose={() => setModalOpen(false)}
        imageUrl={modalImageUrl}
      />
    </div>
  );
}
