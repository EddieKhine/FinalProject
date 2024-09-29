import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const MyAuctions = () => {
  const [auctions, setAuctions] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [editAuctionId, setEditAuctionId] = useState(null); // State to track which auction is being edited
  const [editableData, setEditableData] = useState({}); // State to hold editable auction data
  const router = useRouter();

  // Retrieve user data from local storage
  const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user')) : null;
  const userId = user ? user.id : null;

  useEffect(() => {
    if (!userId) {
      router.push('/'); // Redirect to login if not authenticated
    } else {
      fetchMyAuctions(); // Fetch user's auctions when userId is available
    }
  }, [userId, router]);

  const fetchMyAuctions = async () => {
    try {
      const response = await fetch(`/api/my-auctions?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setAuctions(data); // Set the user's auctions
      } else {
        throw new Error('Failed to fetch auctions');
      }
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const handleEdit = (auction) => {
    setEditAuctionId(auction._id);
    setEditableData(auction); // Set the editable data to the current auction's data
  };

  const handleCancel = () => {
    setEditAuctionId(null); // Exit edit mode
    setEditableData({}); // Clear editable data
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditableData({ ...editableData, [name]: value }); // Update editable data as the user types
  };

  const handleUpdate = async (auctionId) => {
    try {
      const response = await fetch(`/api/update-auction/${auctionId}`, {
        method: 'POST', // Use POST method for updating
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editableData), // Send updated auction data without image field
      });

      if (response.ok) {
        const updatedAuction = await response.json();
        setAuctions((prev) =>
          prev.map((auction) =>
            auction._id === updatedAuction._id ? updatedAuction : auction
          )
        );
        setEditAuctionId(null); // Exit edit mode
        setEditableData({}); // Clear editable data
      } else {
        const data = await response.json();
        setErrorMessage(data.message || 'Failed to update auction.');
      }
    } catch (error) {
      setErrorMessage('Error updating auction.');
    }
  };

  const handleDelete = async (auctionId) => {
    try {
      const response = await fetch(`/api/delete-auction/${auctionId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setAuctions((prev) => prev.filter((auction) => auction._id !== auctionId)); // Remove the deleted auction from the state
      } else {
        throw new Error('Failed to delete auction');
      }
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const chooseWinner = async (auctionId, bidId) => {
    try {
      const response = await fetch(`/api/choose-winner`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          auctionId,
          bidId,
        }),
      });

      if (response.ok) {
        alert('Winner chosen successfully!');
        fetchMyAuctions(); // Refresh auctions
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to choose winner.');
      }
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="container">
      <h2>My Auctions</h2>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      {auctions.length > 0 ? (
        auctions.map((auction) => (
          <div key={auction._id} className="auction">
            {editAuctionId === auction._id ? (
              <div>
                <input
                  type="text"
                  name="name"
                  value={editableData.name}
                  onChange={handleChange}
                  placeholder="Auction Name"
                />
                <textarea
                  name="description"
                  value={editableData.description}
                  onChange={handleChange}
                  placeholder="Description"
                />
                <input
                  type="datetime-local"
                  name="startAuction"
                  value={new Date(editableData.startAuction).toISOString().slice(0, -8)}
                  onChange={handleChange}
                />
                <input
                  type="datetime-local"
                  name="endAuction"
                  value={new Date(editableData.endAuction).toISOString().slice(0, -8)}
                  onChange={handleChange}
                />
                <button onClick={() => handleUpdate(auction._id)}>Save</button>
                <button onClick={handleCancel}>Cancel</button>
              </div>
            ) : (
              <div>
                <h3>{auction.name}</h3>
                <p>{auction.description}</p>
                {/* Display the auction image if it exists */}
                {auction.imagePath && (
                  <img
                    src={auction.imagePath}
                    alt={auction.name}
                    style={{ width: '200px', height: 'auto', objectFit: 'cover' }}
                  />
                )}
                <p>Start Time: {new Date(auction.startAuction).toLocaleString()}</p>
                <p>End Time: {new Date(auction.endAuction).toLocaleString()}</p>
                <p>Status: {auction.isActive ? 'Active' : 'Inactive'}</p> {/* Show auction status */}

                <button onClick={() => handleEdit(auction)} disabled={!auction.isActive}>
                  Edit
                </button>
                <button onClick={() => handleDelete(auction._id)} style={{ marginLeft: '10px' }}>
                  Delete
                </button>
                {/* Render the bids associated with this auction */}
                {auction.bids && auction.bids.length > 0 && (
                  <div className="bids">
                    <h4>Bids</h4>
                    {auction.bids.map((bid) => (
                      <div key={bid._id} className="bid">
                        <p><strong>Bidder:</strong> {bid.bidder ? bid.bidder.username : 'Unknown Bidder'}</p>
                        <p><strong>Item Name:</strong> {bid.itemName}</p>
                        <p><strong>Item Description:</strong> {bid.itemDescription}</p>
                        {bid.itemImage && (
                          <img 
                            src={bid.itemImage.startsWith('/uploads') ? bid.itemImage : `/uploads/bids/${bid.itemImage}`} 
                            alt={bid.itemName} 
                            style={{ width: '200px', height: 'auto' }} 
                          />
                        )}
                        <button onClick={() => chooseWinner(auction._id, bid._id)} disabled={!auction.isActive}>Choose as Winner</button>
                      </div>
                    ))}
                  </div>
                )}
                {/* Show winning bid if auction is inactive */}
                {!auction.isActive && auction.winner && (
                  <div className="winning-bid">
                    <h4>Winning Bid</h4>
                    <p><strong>Bidder:</strong> {auction.winner.bidder ? auction.winner.bidder.username : 'Unknown Bidder'}</p>
                    <p><strong>Item Name:</strong> {auction.winner.itemName || 'N/A'}</p>
                    <p><strong>Item Description:</strong> {auction.winner.itemDescription || 'N/A'}</p>
                    {auction.winner.itemImage && (
                      <img
                        src={auction.winner.itemImage.startsWith('/uploads') ? auction.winner.itemImage : `/uploads/bids/${auction.winner.itemImage}`}
                        alt={auction.winner.itemName}
                        style={{ width: '200px', height: 'auto' }}
                      />
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        ))
      ) : (
        <p>No auctions available.</p>
      )}
      <style jsx>{`
        .container {
          max-width: 800px;
          margin: 2rem auto;
          padding: 1rem;
          margin-top: 100px;
          border: 1px solid #ccc;
          border-radius: 5px;
          background-color: #fff;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          border: none;
        }
        .auction {
          padding: 1rem;
          border-bottom: 1px solid #ccc;
          margin-bottom: 1rem;
        }
        .bids {
          margin-top: 1rem;
          padding: 1rem;
          background: #ffe;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
        .bid {
          padding: 0.5rem 0;
          border-bottom: 1px solid #ddd;
        }
        .bid:last-child {
          border-bottom: none;
        }
        .winning-bid {
          margin-top: 1rem;
          padding: 1rem;
          background: #e0ffe0;
          border: 1px solid #ccc;
          border-radius: 4px;
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
        button:disabled {
          background-color: #ccc;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default MyAuctions;
