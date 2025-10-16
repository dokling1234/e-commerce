import React from "react";
import "../../css/styles.css";

const ViewModal = ({ data, onClose }) => {
  if (!data) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <div className="modal-header">
          <h2>Item Details</h2>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-content">
          <p><strong>ID:</strong> {data.id}</p>
          <p><strong>AR Ref No.:</strong> {data.arRef}</p>
          <p><strong>Name:</strong> {data.name}</p>
          <p><strong>Category:</strong> {data.category}</p>
          <p><strong>Size:</strong> {data.size}</p>
          <p><strong>Price:</strong> ₱{data.price}</p>
          <p><strong>Status:</strong> {data.status}</p>
          <p><strong>Description:</strong> {data.description}</p>
        </div>

        <div className="modal-actions">
          <button className="btn primary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewModal;
