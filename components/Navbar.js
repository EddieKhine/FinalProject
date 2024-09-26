// components/Navbar.js
import Link from 'next/link';
import { useEffect, useState } from 'react';

const Navbar = () => {
  const [username, setUsername] = useState('');

  useEffect(() => {
    const storedUsername = localStorage.getItem('username'); // Assuming you store username in localStorage
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    // Redirect to login page or home
    window.location.href = '/login'; // Change this as needed
  };

  return (
    <nav>
      <ul>
        <li><Link href="/">Home</Link></li>
        <li><Link href="/create-auction">Create Auction</Link></li>
        <li><Link href="/view-my-auctions">View My Auctions</Link></li>
        <li><Link href="/dashboard">Dashboard</Link></li>
        <li>{username ? <span>{username}</span> : <Link href="/login">Login</Link>}</li>
        {username && <li><button onClick={handleLogout}>Logout</button></li>}
      </ul>
      <style jsx>{`
        nav {
          background-color: #333;
          padding: 1rem;
        }
        ul {
          list-style: none;
          display: flex;
          gap: 1rem;
        }
        li {
          color: white;
        }
        a {
          color: white;
          text-decoration: none;
        }
        button {
          background-color: #f00;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
