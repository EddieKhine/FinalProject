"use client"; // Mark this component as a Client Component

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // Use next/navigation for App Router compatibility
import { signIn } from 'next-auth/react';

const LandingPage = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [auctions, setAuctions] = useState([]);
  const router = useRouter();

  useEffect(() => {
    // Check if username is stored in local storage on component mount
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUsername(user.username); // Set the username state
    }
  }, []);

  useEffect(() => {
    // Fetch active auction data when the component mounts
    const fetchAuctions = async () => {
      try {
        const response = await fetch('/api/auctions'); // Fetch active auctions from your dashboard API
        if (response.ok) {
          const data = await response.json();
          setAuctions(data); // Set the fetched auctions to the state
        } else {
          console.error('Failed to fetch auctions');
        }
      } catch (error) {
        console.error('Error fetching auctions:', error);
      }
    };

    fetchAuctions();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    const result = await signIn('credentials', {
      redirect: false, // Prevent automatic redirection
      username,
      password,
    });

    if (result.error) {
      alert('Login failed. Please check your username and password.');
    } else {
      // Fetch session to get user information
      const session = await fetch('/api/auth/session').then((res) => res.json());

      if (session?.user) {
        // Store user information in local storage
        localStorage.setItem('user', JSON.stringify({
          id: session.user.id,
          username: session.user.username,
          email: session.user.email,
        }));

        setUsername(session.user.username); // Update state with the logged-in user's username
      }

      setIsLoginModalOpen(false); // Close the modal on success
      router.push('/dashboard'); // Redirect to dashboard
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    const result = await fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await result.json();

    if (result.ok) {
      alert('Registration successful');
      setIsSignupModalOpen(false); // Close modal on success
    } else {
      alert(data.message || 'Registration failed');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // You can add any additional search logic here if needed
  };

  // Filter auctions based on search query
  const filteredAuctions = auctions.filter((auction) =>
    auction.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <nav className="bg-gray-800 p-4 flex justify-between items-center">
        <div className="flex items-center">
          <div className="text-white text-xl font-bold">TradeBarterHub</div>
          <form onSubmit={handleSearch} className="flex items-center ml-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="px-4 py-2 border border-gray-300 rounded-l-md h-10 w-64"
            />
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-600 h-10"
            >
              Search
            </button>
          </form>
        </div>
        <div className="flex space-x-4">
          {username ? (
            <>
              <span className="text-white">Welcome, {username}</span>
              <button
                onClick={() => {
                  localStorage.removeItem('user'); // Clear user data from local storage
                  setUsername(''); // Reset the state
                  router.push('/'); // Redirect to home page
                }}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
              >
                Login
              </button>
              <button
                onClick={() => setIsSignupModalOpen(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-600"
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center p-4">
        <h1 className="text-4xl font-bold mb-8">Welcome to TradeBarterHub!</h1>

        {/* Display auction data */}
        {filteredAuctions.length > 0 ? (
          <div className="w-full max-w-3xl">
            <h2 className="text-2xl font-bold mb-4">Active Auctions</h2>
            <ul className="space-y-4">
              {filteredAuctions.map((auction) => (
                <li key={auction._id} className="border p-4 rounded-lg shadow-md">
                  <h3 className="text-xl font-bold">{auction.name}</h3>
                  <p>{auction.description}</p>
                  <p>
                    <strong>Start:</strong> {new Date(auction.startAuction).toLocaleString()}
                  </p>
                  <p>
                    <strong>End:</strong> {new Date(auction.endAuction).toLocaleString()}
                  </p>

                  {/* Display bids */}
                  {auction.bids && auction.bids.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-lg font-semibold">Bidders</h4>
                      <ul className="space-y-2">
                        {auction.bids.map((bid) => (
                          <li key={bid._id} className="border p-2 rounded-md bg-gray-100">
                            <p><strong>Bidder:</strong> {bid.bidder ? bid.bidder.username : 'Unknown Bidder'}</p>
                            <p><strong>Item Name:</strong> {bid.itemName}</p>
                            <p><strong>Item Description:</strong> {bid.itemDescription}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p>No auctions available at the moment.</p>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 p-4 text-center text-white">
        © 2024 TradeBarterHub. All rights reserved.
      </footer>

      {/* Login Modal */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-md shadow-lg relative max-w-lg w-full">
            <h2 className="text-2xl font-bold mb-4 text-black">Login</h2>
            <button
              className="absolute top-2 right-2 text-gray-500"
              onClick={() => setIsLoginModalOpen(false)}
            >
              &times;
            </button>
            <form onSubmit={handleLogin}>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                required
                className="block w-full px-4 py-2 mb-4 border border-gray-300 rounded-md"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                className="block w-full px-4 py-2 mb-4 border border-gray-300 rounded-md"
              />
              <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                Login
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Signup Modal */}
      {isSignupModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-md shadow-lg relative max-w-lg w-full">
            <h2 className="text-2xl font-bold mb-4 text-black">Sign Up</h2>
            <button
              className="absolute top-2 right-2 text-gray-500"
              onClick={() => setIsSignupModalOpen(false)}
            >
              &times;
            </button>
            <form onSubmit={handleSignup}>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                required
                className="block w-full px-4 py-2 mb-4 border border-gray-300 rounded-md"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
                className="block w-full px-4 py-2 mb-4 border border-gray-300 rounded-md"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                className="block w-full px-4 py-2 mb-4 border border-gray-300 rounded-md"
              />
              <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                Sign Up
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
