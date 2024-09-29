import { useState, useEffect } from 'react';

const Dashboard = () => {
  const [auctions, setAuctions] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedAuction, setSelectedAuction] = useState(null);
  const [itemName, setItemName] = useState('');
  const [itemDescription, setItemDescription] = useState('');
  const [itemImage, setItemImage] = useState(null);
  const [bidMessage, setBidMessage] = useState('');

  // Fetch user ID from local storage
  const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user')) : null;
  const userId = user ? user.id : null;

  // Fetch auctions from dashboard API
  useEffect(() => {
    const fetchAuctions = async () => {
      if (!userId) {
        setError('User ID is missing');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/dashboard?userId=${userId}`);

        if (!response.ok) {
          throw new Error('Failed to fetch auctions from dashboard');
        }

        const data = await response.json();
        setAuctions(data); // Set the auctions returned by the API
        setLoading(false);
      } catch (error) {
        console.error('Error fetching auctions:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchAuctions();
  }, [userId]);

  const handleOpenModal = (auction) => {
    setSelectedAuction(auction);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setItemName('');
    setItemDescription('');
    setItemImage(null);
    setBidMessage('');
  };

  const handleImageChange = (e) => {
    setItemImage(e.target.files[0]);
  };

  const handleBidSubmit = async () => {
    if (!itemName || !itemDescription) {
      setBidMessage('Please provide all the required fields.');
      return;
    }

    const formData = new FormData();
    formData.append('auctionId', selectedAuction._id);
    formData.append('bidderId', userId); // Use userId from local storage
    formData.append('itemName', itemName);
    formData.append('itemDescription', itemDescription);
    if (itemImage) {
      formData.append('image', itemImage);
    }

    try {
      const response = await fetch('/api/add-bid', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setBidMessage('Bid placed successfully!');
        setTimeout(() => {
          handleCloseModal();
        }, 2000);
      } else {
        const data = await response.json();
        setBidMessage(data.message || 'Error placing bid.');
      }
    } catch (error) {
      setBidMessage('Error placing bid.');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="dashboard-container">
      <h1 className='title'>Active Auctions</h1>

      {/* Display fetched auctions */}
      <div className="grid-container">
        {auctions.length > 0 ? (
          auctions.map((auction) => (
            <div key={auction._id} className="grid-item">
              <h2 className="auction-title">{auction.name}</h2>
              <p className="auction-description">{auction.description}</p>
              <p><strong>Start:</strong> {new Date(auction.startAuction).toLocaleString()}</p>
              <p><strong>End:</strong> {new Date(auction.endAuction).toLocaleString()}</p>
              <p><strong>Creator:</strong> {auction.creator.username}</p>

              {/* Display the auction image if it exists */}
              {auction.imagePath && (
                <img
                  src={auction.imagePath}
                  alt={auction.name}
                  className="auction-image"
                />
              )}

              {/* Place Bid Button */}
              <button className="primary-button" onClick={() => handleOpenModal(auction)}>
                Place Bid
              </button>

              {/* Display auction bids */}
              {auction.bids && auction.bids.length > 0 ? (
                <div className="bids-section">
                  <h3>Bids</h3>
                  {auction.bids.map((bid) => (
                    <div key={bid._id} className="bid">
                      <p><strong>Bidder:</strong> {bid.bidder.username}</p>
                      <p><strong>Item:</strong> {bid.itemName}</p>
                      <p><strong>Description:</strong> {bid.itemDescription}</p>

                      {bid.itemImage && (
                        <img
                          src={bid.itemImage.startsWith('/uploads') ? bid.itemImage : `/uploads/bids/${bid.itemImage}`}
                          alt={bid.itemName}
                          className="bid-image"
                        />
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p>No bids yet</p>
              )}
            </div>
          ))
        ) : (
          <p>No active auctions available</p>
        )}
      </div>

      {/* Modal for placing a bid */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Place a Bid for {selectedAuction.name}</h2>

            <label htmlFor="itemName">Item Name</label>
            <input
              type="text"
              id="itemName"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              required
            />

            <label htmlFor="itemDescription">Item Description</label>
            <textarea
              id="itemDescription"
              value={itemDescription}
              onChange={(e) => setItemDescription(e.target.value)}
              required
            ></textarea>

            <label htmlFor="itemImage">Item Image</label>
            <input type="file" id="itemImage" onChange={handleImageChange} />

            <button className="primary-button" onClick={handleBidSubmit}>Submit Bid</button>
            <button className="secondary-button" onClick={handleCloseModal}>Close</button>

            {bidMessage && <p>{bidMessage}</p>}
          </div>
        </div>
      )}

      {/* Updated CSS with button and component enhancements */}
      <style jsx>{`
        .dashboard-container {
          max-width: 1200px;
          margin: 0 auto;
          margin-top: 150px;
          padding: 20px;
          
        }
        .title{
        font-size:3rem;
        margin-button: 2rem;
        }
        .grid-container {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
          padding: 1rem;
          border: none;
        }

        .grid-item {
          background-color: #fff;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          padding: 20px;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          position: relative;
        }

        .grid-item:hover {
          transform: translateY(-10px);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
        }

        .auction-title {
          font-size: 1.6rem;
          margin-bottom: 10px;
          color: #007bff;
          font-weight: bold;
        }

        .auction-description {
          font-size: 1rem;
          color: #666;
          margin-bottom: 10px;
        }

        .auction-image {
          width: 100%;
          height: auto;
          border-radius: 4px;
          margin-bottom: 1rem;
        }

        .primary-button {
          padding: 10px 20px;
          background-color: #28a745;
          color: #fff;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: bold;
          text-transform: uppercase;
          transition: background-color 0.3s ease;
        }

        .primary-button:hover {
          background-color: #218838;
        }

        .secondary-button {
          padding: 10px 20px;
          background-color: #dc3545;
          color: #fff;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: bold;
          text-transform: uppercase;
          margin-left: 10px;
          transition: background-color 0.3s ease;
        }

        .secondary-button:hover {
          background-color: #c82333;
        }

        .bids-section {
          margin-top: 20px;
          padding: 10px;
          background-color: #f8f9fa;
          border-radius: 4px;
          border: 1px solid #dee2e6;
        }

        .bid {
          padding: 10px 0;
          border-bottom: 1px solid #ccc;
        }

        .bid:last-child {
          border-bottom: none;
        }

        .bid-image {
          max-width: 200px;
          height: auto;
          display: block;
          margin-top: 10px;
          border-radius: 4px;
        }

        .modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .modal-content {
          background-color: white;
          padding: 20px;
          border-radius: 8px;
          width: 400px;
          max-width: 100%;
        }

        .modal-content h2 {
          margin-top: 0;
          color: #007bff;
        }

        .modal-content input,
        .modal-content textarea {
          width: 100%;
          padding: 10px;
          margin-bottom: 10px;
          border: 1px solid #ccc;
          border-radius: 4px;
        }

        .modal-content button {
          margin-top: 10px;
        }

        .modal-content button:first-of-type {
          margin-right: 10px;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
