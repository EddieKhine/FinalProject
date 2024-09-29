import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { Popover } from '@headlessui/react';

const Navbar = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (session) {
        try {
          const response = await fetch('/api/user');
          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
          } else {
            console.error('Failed to fetch user data');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchUserData();
  }, [session]);

  const handleLogout = async () => {
    signOut();
    router.push('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Search query:', searchQuery);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-gray-800 p-6 flex justify-between items-center z-10 shadow-md">
      <div className="flex items-center">
        <div className="text-white text-2xl font-bold">TradeBarterHub</div>

        {/* Home Button - Only show if not on Dashboard */}
        {router.pathname !== '/dashboard' && (
          <Link href="/dashboard">
            <button className="text-lg bg-black-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 mr-4">
              Home
            </button>
          </Link>
        )}
      </div>
      <div className="flex items-center ml-auto">
        {session && user ? (
          <>
            <Link href="/profile">
              <button className="bg-green-600 text-white w-12 h-12 text-xl rounded-full hover:bg-green-700 flex items-center justify-center mr-4">
                {user.username.charAt(0)}
              </button>
            </Link>
            
            <Popover className="relative">
              <Popover.Button className="text-lg bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-600">
                Options
              </Popover.Button>

              <Popover.Panel className="absolute z-10 w-40 mt-2 right-0 bg-gray-800 shadow-lg rounded-md">
                <div className="p-4">
                  <Link href="/view-my-auctions">
                    <div className="block px-4 py-2 text-white hover:bg-gray-600 rounded-md">
                      View Auction
                    </div>
                  </Link>
                  <Link href="/create-auction">
                    <div className="block px-4 py-2 text-white hover:bg-gray-600 rounded-md">
                      Create Auction
                    </div>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-600 rounded-md"
                  >
                    Logout
                  </button>
                </div>
              </Popover.Panel>
            </Popover>
          </>
        ) : null}
      </div>
      <style jsx>{`
        nav {
          position: fixed; 
          top: 0; 
          left: 0;
          right: 0;
          z-index: 1000; 
          height: 80px; /* Increase height */
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
