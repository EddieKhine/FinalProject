// pages/profile.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const Profile = () => {
  const router = useRouter();
  const { userId } = router.query; // Get userId from query params
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (userId) {
      const fetchUserProfile = async () => {
        const response = await fetch(`/api/profile?userId=${userId}`);
        if (response.ok) {
          const data = await response.json();
          setUser(data);
        } else {
          console.error('Failed to fetch user profile');
        }
      };

      fetchUserProfile();
    }
  }, [userId]);

  if (!user) return <div>Loading...</div>;

  return (
    <div>
      <h1>User Profile</h1>
      <p>User ID: {user._id}</p>
      <p>Username: {user.username}</p>
    </div>
  );
};

export default Profile;
