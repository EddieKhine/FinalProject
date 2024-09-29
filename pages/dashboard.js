import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const Dashboard = () => {
  const [auctions, setAuctions] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [bidMessage, setBidMessage] = useState('');

  // State for bid inputs
  const [itemName, setItemName] = useState('');
  const [itemDescription, setItemDescription] = useState('');

  // State for search query
  const [searchQuery, setSearchQuery] = useState('');

  // Retrieve user data from local storage
  const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user')) : null;
  const userId = user ? user.id : null;
  const router = useRouter();

  useEffect(() => {
    // Redirect to login if user ID is not available
    if (!userId) {
      router.push('/');
    }
  }, [userId, router]);

  const fetchData = async () => {
    try {
      // Include userId in the query parameters to filter out inactive auctions
      const response = await fetch(`/api/dashboard?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setAuctions(data.filter(auction => auction.isActive)); // Set the auctions data and filter for active ones
      } else {
        throw new Error('Failed to fetch auctions');
      }
    } catch (error) {
      setErrorMessage(error.message); // Set the error message
    }
  };

  useEffect(() => {
    // Fetch auctions only if the user is authenticated
    if (userId) {
      fetchData();
    }
  }, [userId]);

  // Function to handle bid submission
  const handleBid = async (auctionId) => {
    try {
      const response = await fetch('/api/bid', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          auctionId,
          userId,
          itemName,
          itemDescription,
        }),
      });

      if (response.ok) {
        setBidMessage('Bid placed successfully!');
        setItemName(''); // Clear item name field
        setItemDescription(''); // Clear item description field
        fetchData(); // Fetch updated auctions to show the new bid
      } else {
        throw new Error('Failed to place bid');
      }
    } catch (error) {
      setBidMessage(error.message);
    }
  };

  // Filter auctions based on search query
  const filteredAuctions = auctions.filter(auction =>
    auction.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className='container'>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search Items by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} // Update search query state
          className="search-input"
        />
      </div>

      {filteredAuctions.length > 0 ? (
        filteredAuctions.map((auction) => (
          <div key={auction._id} className="auction">
            <h3>{auction.name}</h3>
            <h3>{auction.creator ? auction.creator.username : 'Unknown Creator'}</h3>
            <p>{auction.description}</p>
            <p>Start Time: {new Date(auction.startAuction).toLocaleString()}</p>
            <p>End Time: {new Date(auction.endAuction).toLocaleString()}</p>

            {/* Bid Form */}
            <div className="bid-form">
              <h4>Place a Bid</h4>
              <input
                type="text"
                placeholder="Item Name"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)} // Update item name state
              />
              <textarea
                placeholder="Item Description"
                value={itemDescription}
                onChange={(e) => setItemDescription(e.target.value)} // Update item description state
              ></textarea>
              <button onClick={() => handleBid(auction._id)}>Place Bid</button>
              {bidMessage && <p>{bidMessage}</p>}
            </div>

            {/* Display Bids */}
            {auction.bids && auction.bids.length > 0 && (
              <div className="bids">
                <h4>Current Bids</h4>
                {auction.bids.map((bid) => (
                  <div key={bid._id} className="bid">
                    <p><strong>Bidder:</strong> {bid.bidder ? bid.bidder.username : 'Unknown Bidder'}</p>
                    <p><strong>Item Name:</strong> {bid.itemName}</p>
                    <p><strong>Item Description:</strong> {bid.itemDescription}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))
      ) : (
        <p>No active auctions available.</p>
      )}

      <style jsx>{`
        .container {
          max-width: 800px;
          margin: 2rem auto;
          margin-top: 80px;
          padding: 1rem;
          border: 1px solid #ddd;
          border-radius: 5px;
          background-color: #f0f4ff; /* Replace with your navbar background color */
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        .search-bar {
          margin-bottom: 1rem;
          text-align: center;
        }
        .search-input {
          padding: 0.5rem;
          border: 1px solid #ccc;
          border-radius: 4px;
          width: 100%;
          max-width: 400px;
        }
        .auction {
          margin-bottom: 2rem;
          padding: 1rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          background: #ffffff; /* Replace with your auction card background color */
        }
        .bid-form {
          margin-top: 1rem;
          padding: 1rem;
          background: #e6f7ff; /* Replace with your bid form background color */
          border: 1px solid #ccc;
          border-radius: 4px;
        }
        .bid-form input,
        .bid-form textarea {
          display: block;
          width: 100%;
          padding: 0.5rem;
          margin-bottom: 0.5rem;
          border: 1px solid #ddd;
          border-radius: 4px;
        }
        .bids {
          margin-top: 1rem;
          padding: 1rem;
          background: #ffe; /* Replace with your bids background color */
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
        button {
          background-color: #0070f3; /* Replace with your button color */
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          cursor: pointer;
          border-radius: 4px;
          transition: background-color 0.3s;
        }
        button:hover {
          background-color: #005bb5; /* Replace with your button hover color */
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
