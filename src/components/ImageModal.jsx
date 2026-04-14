import React, { useState } from "react";
import ReactModal from "react-modal";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import {
  FaSearchPlus,
  FaSearchMinus,
  FaUndoAlt,
  FaRedoAlt,
  FaSyncAlt,
} from "react-icons/fa";
import "./ImageModal.css";

ReactModal.setAppElement("#root");

export default function ImageModal({ isOpen, onRequestClose, imageUrl, title, description }) {
  const [angle, setAngle] = useState(0);

  const rotateLeft = () => setAngle((prev) => prev - 90);
  const rotateRight = () => setAngle((prev) => prev + 90);
  const resetAll = (resetTransform) => {
    resetTransform();
    setAngle(0);
  };

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="modal-content"
      overlayClassName="modal-overlay"
    >
      <button className="modal-close" onClick={onRequestClose}>
        &times;
      </button>

      <div className="zoom-container">
        <TransformWrapper
          initialScale={1}
          minScale={0.5}
          maxScale={10}
          wheel={{ step: 0.1 }}
          doubleClick={{ disabled: true }}
        >
          {({ zoomIn, zoomOut, resetTransform }) => (
            <>
              <div className="tools-container">
                <button onClick={() => zoomIn()} aria-label="Zoom In">
                  <FaSearchPlus />
                </button>
                <button onClick={() => zoomOut()} aria-label="Zoom Out">
                  <FaSearchMinus />
                </button>
                <button onClick={rotateLeft} aria-label="Rotate Left">
                  <FaUndoAlt />
                </button>
                <button onClick={rotateRight} aria-label="Rotate Right">
                  <FaRedoAlt />
                </button>
                <button onClick={() => resetAll(resetTransform)} aria-label="Reset">
                  <FaSyncAlt />
                </button>
              </div>

              <TransformComponent>
                <img
                  src={imageUrl}
                  alt="Zoomable"
                  style={{
                    width: "100%",
                    height: "auto",
                    userSelect: "none",
                    transform: `rotate(${angle}deg)`,
                    transition: "transform 0.3s",
                  }}
                />
              </TransformComponent>
            </>
          )}
        </TransformWrapper>
      </div>

      {(title || description) && (
        <div className="modal-info-overlay">
          {title && <h2 className="modal-info-title">{title}</h2>}
          {description && <p className="modal-info-desc">{description}</p>}
        </div>
      )}
    </ReactModal>
  );
}
