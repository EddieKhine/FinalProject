import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const CreateAuction = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startAuction: '',
    endAuction: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showModal, setShowModal] = useState(false); // State to manage modal visibility
  const router = useRouter();

  // Retrieve user data from local storage
  const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user')) : null;
  const userId = user ? user.id : null;

  useEffect(() => {
    // Redirect to login if user ID is not available
    if (!userId) {
      router.push('/login');
    }
  }, [userId, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate the form data
    if (!formData.name || !formData.description || !formData.startAuction || !formData.endAuction) {
      setErrorMessage('Please fill in all fields.');
      return;
    }

    if (new Date(formData.startAuction) >= new Date(formData.endAuction)) {
      setErrorMessage('End time must be after start time.');
      return;
    }

    setErrorMessage(''); // Clear any existing error messages

    try {
      const response = await fetch('/api/create-auction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          creator: userId, // Use user ID from local storage
        }),
      });

      if (response.ok) {
        setSuccessMessage('Auction created successfully!');
        setShowModal(true); // Show the modal on successful creation
        setFormData({
          name: '',
          description: '',
          startAuction: '',
          endAuction: '',
        }); // Clear form data
      } else {
        const data = await response.json();
        setErrorMessage(data.message || 'Error creating auction.');
      }
    } catch (error) {
      console.error('Error creating auction:', error.message);
      setErrorMessage('Error creating auction.');
    }
  };

  const handleCloseModal = () => {
    setShowModal(false); // Close the modal
  };

  return (
    <div className="container">
      <h2>Create New Auction</h2>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Auction Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="startAuction">Start Time</label>
          <input
            type="datetime-local"
            id="startAuction"
            name="startAuction"
            value={formData.startAuction}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="endAuction">End Time</label>
          <input
            type="datetime-local"
            id="endAuction"
            name="endAuction"
            value={formData.endAuction}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Create Auction</button>
      </form>

      {/* Modal for success message */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleCloseModal}>&times;</span>
            <h3>You have successfully created an auction!</h3>
            <div className="modal-buttons">
              <button className="green-button" onClick={() => router.push('/dashboard')}>Go to Dashboard</button>
              <button className="green-button" onClick={() => router.push('/view-my-auction')}>View My Auction</button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .container {
          max-width: 600px;
          margin: 2rem auto;
          padding: 1rem;
          margin-top: 80px;
          border: 1px solid #ccc;
          border-radius: 5px;
          background-color: #fff;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        .form-group {
          margin-bottom: 1rem;
        }
        label {
          display: block;
          font-weight: bold;
          margin-bottom: 0.5rem;
        }
        input,
        textarea {
          width: 100%;
          padding: 0.5rem;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
        textarea {
          resize: vertical; /* Allow vertical resizing */
        }
        button {
          background-color: #0070f3;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          cursor: pointer;
          border-radius: 4px;
          margin-top: 10px;
          transition: background-color 0.3s;
        }
        button:hover {
          background-color: #005bb5;
        }

        /* Modal styles */
        .modal {
          display: flex;
          justify-content: center;
          align-items: center;
          position: fixed;
          z-index: 1;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          overflow: auto;
          background-color: rgba(0, 0, 0, 0.5);
        }
        .modal-content {
          background-color: #fff;
          padding: 20px;
          width: 500px; /* Adjust the size of the modal to match landing page */
          border-radius: 10px;
          text-align: center;
          position: relative;
        }
        .close {
          position: absolute;
          top: 10px;
          right: 20px;
          font-size: 24px;
          cursor: pointer;
        }
        h3 {
          font-size: 1.5rem; /* Increase text size */
        }
        .modal-buttons {
          margin-top: 20px;
        }
        .green-button {
          background-color: #16a34a; /* Green-600 */
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          cursor: pointer;
          border-radius: 4px;
          margin: 5px;
          font-size: 1rem; /* Increase button text size */
        }
        .green-button:hover {
          background-color: #15803d; /* Darker green on hover */
        }
      `}</style>
    </div>
  );
};

export default CreateAuction;
