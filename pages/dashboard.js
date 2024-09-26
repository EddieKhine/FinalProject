import { useEffect, useState } from 'react';

const Dashboard = () => {
  const [auctions, setAuctions] = useState([]);

  const fetchAuctions = async () => {
    try {
      const response = await fetch('/api/auctions');
      if (!response.ok) {
        throw new Error('Failed to fetch auctions');
      }
      const data = await response.json();
      setAuctions(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAuctions();
  }, []);

  return (
    <div>
      <h1>Auctions</h1>
      {auctions.length > 0 ? (
        auctions.map((auction) => (
          <div key={auction._id}>
            <h2>{auction.name}</h2>
            <p>{auction.description}</p>
            <p>Start Time: {new Date(auction.startTime).toLocaleString()}</p>
            <p>End Time: {new Date(auction.endTime).toLocaleString()}</p>
            {auction.photo && (
              <img
                src={auction.photo}
                alt={auction.name}
                style={{ width: '200px', height: 'auto' }}
              />
            )}
          </div>
        ))
      ) : (
        <p>No auctions available</p>
      )}
    </div>
  );
};

export default Dashboard;
