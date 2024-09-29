import { useState, useEffect } from 'react';

const MyWinningBids = () => {
  const [winningBids, setWinningBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch user ID from local storage
  const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user')) : null;
  const userId = user ? user.id : null;

  useEffect(() => {
    const fetchWinningBids = async () => {
      if (!userId) {
        setError('User not logged in');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/my-winning-bids?userId=${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch winning bids');
        }

        const data = await response.json();
        setWinningBids(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchWinningBids();
  }, [userId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="container">
      <h1>My Winning Bids</h1>

      {winningBids.length > 0 ? (
        winningBids.map((auction) => (
          <div key={auction._id} className="auction">
            <h2>{auction.name}</h2> {/* Auction Information */}
            <p><strong>Description:</strong> {auction.description}</p>
            <p><strong>Start:</strong> {new Date(auction.startAuction).toLocaleString()}</p>
            <p><strong>End:</strong> {new Date(auction.endAuction).toLocaleString()}</p>
            <p><strong>Creator:</strong> {auction.creator.username}</p>
            {auction.imagePath && (
                <img
                  src={auction.imagePath}
                  alt={auction.name}
                  className="auction-image"
                />
              )}

            {/* Winning Bid Information */}
            <div className="winning-bid">
              <h3>Winning Bid</h3>
              <p><strong>Item Name:</strong> {auction.winner.itemName}</p>
              <p><strong>Item Description:</strong> {auction.winner.itemDescription}</p>
              {auction.winner.itemImage && (
                <img
                  src={auction.winner.itemImage}
                  alt={auction.winner.itemName}
                  style={{ width: '200px', height: 'auto' }}
                />
              )}
            </div>
          </div>
        ))
      ) : (
        <p>You have no winning bids yet.</p>
      )}

      <style jsx>{`
        .container {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          margin-top: 100px;
        }

        .auction {
          border: 1px solid #ccc;
          padding: 15px;
          border-radius: 5px;
          margin-bottom: 15px;
          background-color: #f9f9f9;
        }

        .auction img {
          margin-top: 10px;
          border-radius: 4px;
        }

        .winning-bid {
          padding: 15px;
          background-color: #e0f7e0;
          border: 1px solid #ccc;
          border-radius: 4px;
          margin-top: 10px;
        }

        .winning-bid img {
          margin-top: 10px;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
};

export default MyWinningBids;
