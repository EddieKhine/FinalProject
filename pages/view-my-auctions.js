// pages/view-my-auctions.js
import { useEffect, useState } from 'react';

const ViewMyAuctions = () => {
  const [myAuctions, setMyAuctions] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [username, setUsername] = useState('');

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }

    const fetchData = async () => {
      const response = await fetch('/api/auctions');
      if (response.ok) {
        const data = await response.json();
        // Filter for auctions created by the logged-in user using username
        const filteredMyAuctions = data.filter(auction => auction.creator && auction.creator.username === storedUsername);
        setMyAuctions(filteredMyAuctions);
      } else {
        console.error('Failed to fetch my auctions');
        setErrorMessage('Failed to fetch my auctions');
      }
    };

    if (storedUsername) {
      fetchData(); // Fetch auctions only if username exists
    }
  }, []);

  return (
    <div>
      <h1>My Auctions</h1>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      {myAuctions.length > 0 ? (
        myAuctions.map((auction) => (
          <div key={auction._id}>
            <h2>{auction.name}</h2>
            <p>{auction.description}</p>
            <img src={auction.photo} alt={auction.name} style={{ maxWidth: '200px' }} />
          </div>
        ))
      ) : (
        <p>No auctions posted yet.</p>
      )}
    </div>
  );
};

export default ViewMyAuctions;
