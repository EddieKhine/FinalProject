import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const CreateAuction = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startAuction: '',
    endAuction: '',
    image: null,
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [newAuctionData, setNewAuctionData] = useState(null); // Store newly created auction data
  const router = useRouter();

  const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user')) : null;
  const userId = user ? user.id : null;

  useEffect(() => {
    if (!userId) {
      router.push('/');
    }
  }, [userId, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.description || !formData.startAuction || !formData.endAuction) {
      setErrorMessage('Please fill in all fields.');
      return;
    }

    if (new Date(formData.startAuction) >= new Date(formData.endAuction)) {
      setErrorMessage('End time must be after start time.');
      return;
    }

    setErrorMessage('');

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('description', formData.description);
      data.append('startAuction', formData.startAuction);
      data.append('endAuction', formData.endAuction);
      data.append('creator', userId);
      if (formData.image) {
        data.append('image', formData.image);
      }

      const response = await fetch('/api/create-auction', {
        method: 'POST',
        body: data,
      });

      if (response.ok) {
        const auctionData = await response.json(); // Get auction data from the response
        setSuccessMessage('Auction created successfully!');
        setNewAuctionData(auctionData.auction); // Store new auction data
        setFormData({
          name: '',
          description: '',
          startAuction: '',
          endAuction: '',
          image: null,
        });
      } else {
        const data = await response.json();
        setErrorMessage(data.message || 'Error creating auction.');
      }
    } catch (error) {
      console.error('Error creating auction:', error.message);
      setErrorMessage('Error creating auction.');
    }
  };

  return (
    <div className="container">
      <h2>Create New Auction</h2>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      <form onSubmit={handleSubmit}>
        {/* Form Inputs */}
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
        <div className="form-group">
          <label htmlFor="image">Auction Image</label>
          <input type="file" id="image" name="image" onChange={handleImageChange} />
        </div>
        <button type="submit">Create Auction</button>
      </form>

      {/* Success Popup Card */}
      {newAuctionData && (
        <div className="popup-card">
          <h3>Congratulations! You have created a new auction!</h3>
          <p><strong>Auction Name:</strong> {newAuctionData.name}</p>
          <p><strong>Description:</strong> {newAuctionData.description}</p>
          <p><strong>Start Time:</strong> {newAuctionData.startAuction}</p>
          <p><strong>End Time:</strong> {newAuctionData.endAuction}</p>
          <button onClick={() => router.push('/dashboard')}>Go to Home Page</button>
          <button onClick={() => router.push('/view-my-auctions')}>View My Auctions</button>
        </div>
      )}

      <style jsx>{`
        .container {
          max-width: 600px;
          margin: 0 auto;
          margin-top: 100px;
          padding: 20px;
          background-color: #f9f9f9;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        h2 {
          text-align: center;
          color: #333;
        }

        .form-group {
          margin-bottom: 15px;
        }

        .form-group label {
          display: block;
          font-weight: bold;
          margin-bottom: 5px;
          color: #333;
        }

        .form-group input,
        .form-group textarea {
          width: 100%;
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 4px;
        }

        .form-group input[type="file"] {
          padding: 5px;
        }

        button[type="submit"] {
          width: 100%;
          padding: 12px;
          background-color: #16a34a; /* Green-600 */
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          margin-top: 10px; /* Add margin to separate from the form */
        }

        .popup-card {
          background-color: black;
          color: white;
          padding: 20px;
          border-radius: 8px;
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
          z-index: 1000;
        }

        .popup-card button {
          margin: 10px;
          padding: 10px;
          border: none;
          background-color: #16a34a; /* Green-600 */
          color: white;
          border-radius: 4px;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default CreateAuction;
