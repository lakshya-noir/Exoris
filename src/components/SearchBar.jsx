import React, { useState, useEffect } from "react";
import "../styles/components.css";
import ImageModal from "./ImageModal"; // You need to create this component as described
import { buildApiUrl } from "../utils/apiBaseUrl";

export default function SearchBar({ placeholder, onSearchActive }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImageUrl, setModalImageUrl] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [modalDesc, setModalDesc] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (onSearchActive) {
      onSearchActive(results.length > 0 || loading);
    }
  }, [results, loading, onSearchActive]);

  const handleSearch = async (e, targetPage = 1) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;
    
    // Auto-scroll the scrollable container to the top smoothly right away
    const scrollContainer = document.querySelector(".home-page") || document.documentElement;
    scrollContainer.scrollTo({ top: 0, left: 0, behavior: "smooth" });

    setLoading(true);
    setPage(targetPage);
    try {
      const res = await fetch(
        buildApiUrl(`/api/search/nasa/?q=${encodeURIComponent(query)}&page=${targetPage}`)
      );
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
    setPage(1);
  };

  const handleImageClick = (item) => {
    setModalImageUrl(item.image_url || item.thumbnail_url);
    setModalTitle(item.title);
    setModalDesc(item.description);
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

      {loading && (
        <div className="search-loader">
          <div className="spinner"></div>
          <p className="loading-text">Exploring the cosmos...</p>
        </div>
      )}

      {results.length > 0 && (
        <div className="results-background">
          <div className="image-grid">
            {results.map((item) => (
              <div
                key={item.nasa_id}
                className="image-card"
                onClick={() => handleImageClick(item)}
                style={{ cursor: "zoom-in" }}
              >
                <img
                  src={item.thumbnail_url || item.image_url}
                  alt={item.title}
                  className="grid-image"
                />
                <div className="image-info">
                  <h4>{item.title}</h4>
                  <p className="clamped-desc">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '24px' }}>
            <button
              type="button"
              className="search-button"
              disabled={page === 1}
              onClick={() => handleSearch(null, page - 1)}
              style={page === 1 ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
            >
              Previous Page
            </button>
            <span style={{ color: 'white', alignSelf: 'center' }}>Page {page}</span>
            <button
              type="button"
              className="search-button"
              disabled={results.length < 20}
              onClick={() => handleSearch(null, page + 1)}
              style={results.length < 20 ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
            >
              Next Page
            </button>
          </div>
        </div>
      )}

      <ImageModal
        isOpen={modalOpen}
        onRequestClose={() => setModalOpen(false)}
        imageUrl={modalImageUrl}
        title={modalTitle}
        description={modalDesc}
      />
    </div>
  );
}
