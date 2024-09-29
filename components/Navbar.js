import { useState, useEffect } from 'react';
import { Popover } from '@headlessui/react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';

const Navbar = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    password: '',
    profilePicture: '',
  });

  useEffect(() => {
    const fetchUserData = async () => {
      if (session) {
        try {
          const response = await fetch('/api/user');
          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
            setUserData({
              username: userData.username || '',
              email: userData.email || '',
              password: '', // Leave blank for security
              profilePicture: userData.profilePicture || '',
            });
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

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    // Perform profile update logic here
    setIsModalOpen(false);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 bg-gray-800 p-6 flex justify-between items-center z-10 shadow-md">
        <div className="flex items-center">
          <div className="text-white text-2xl font-bold">TradeBarterHub</div>

          {router.pathname !== '/dashboard' && (
            <button
              onClick={() => router.push('/dashboard')}
              className="text-lg bg-black-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 mr-4"
            >
              Home
            </button>
          )}
        </div>

        <div className="flex items-center ml-auto">
          {session && user ? (
            <>
              <button
                onClick={handleModalOpen}
                className="bg-green-600 text-white w-12 h-12 text-xl rounded-full hover:bg-green-700 flex items-center justify-center mr-4"
              >
                {user.username.charAt(0)}
              </button>

              <Popover className="relative">
                <Popover.Button className="text-lg bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-600">
                  Options
                </Popover.Button>

                <Popover.Panel className="absolute z-10 w-40 mt-2 right-0 bg-gray-800 shadow-lg rounded-md">
                  <div className="p-4">
                    <button
                      onClick={() => router.push('/view-my-auctions')}
                      className="block px-4 py-2 text-white hover:bg-gray-600 rounded-md"
                    >
                      View Auction
                    </button>
                    <button
                      onClick={() => router.push('/create-auction')}
                      className="block px-4 py-2 text-white hover:bg-gray-600 rounded-md"
                    >
                      Create Auction
                    </button>
                    <button
                      onClick={() => router.push('/my-winning-bids')}
                      className="block px-4 py-2 text-white hover:bg-gray-600 rounded-md"
                    >
                      Winning Bids
                    </button>
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
      </nav>

      {/* Profile Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
            <form onSubmit={handleProfileUpdate}>
              <div className="form-group mb-4">
                <label className="block text-gray-700">Username</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  value={userData.username}
                  onChange={(e) =>
                    setUserData({ ...userData, username: e.target.value })
                  }
                />
              </div>
              <div className="form-group mb-4">
                <label className="block text-gray-700">Email</label>
                <input
                  type="email"
                  className="w-full p-2 border rounded"
                  value={userData.email}
                  onChange={(e) =>
                    setUserData({ ...userData, email: e.target.value })
                  }
                />
              </div>
              <div className="form-group mb-4">
                <label className="block text-gray-700">New Password</label>
                <input
                  type="password"
                  className="w-full p-2 border rounded"
                  value={userData.password}
                  onChange={(e) =>
                    setUserData({ ...userData, password: e.target.value })
                  }
                  placeholder="Leave blank to keep current password"
                />
              </div>
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Update Profile
              </button>
              <button
                type="button"
                className="ml-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                onClick={handleModalClose}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        nav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          height: 80px;
        }
        .form-group {
          margin-bottom: 1rem;
        }
      `}</style>
    </>
  );
};

export default Navbar;
