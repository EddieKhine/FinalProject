// Modal.js
import { useState } from 'react';

const Modal = ({ isOpen, onClose, userData, setUserData, handleUpdate }) => {
  const [updatedData, setUpdatedData] = useState(userData);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedData({ ...updatedData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleUpdate(updatedData);
    onClose(); // Close the modal after update
  };

  if (!isOpen) return null; // Don't render anything if modal is not open

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h2>Update Profile</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Username:</label>
            <input
              type="text"
              name="username"
              value={updatedData.username}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={updatedData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>New Password:</label>
            <input
              type="password"
              name="password"
              value={updatedData.password}
              onChange={handleInputChange}
              placeholder="Leave blank to keep current password"
            />
          </div>
          <button type="submit">Update</button>
        </form>
        <button onClick={onClose}>Close</button>
      </div>

      <style jsx>{`
        .modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .modal-content {
          background: white;
          padding: 20px;
          border-radius: 5px;
          max-width: 400px;
          width: 100%;
        }
      `}</style>
    </div>
  );
};

export default Modal;
