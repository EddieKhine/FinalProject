import { useState, useEffect } from 'react';

const Profile = () => {
  const [userData, setUserData] = useState({ username: '', email: '', password: '' });
  const [maskedPassword, setMaskedPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Placeholder activity data
  const [activities, setActivities] = useState([
    { id: 1, text: 'Logged in from new device.', date: '2024-09-28 10:00' },
    { id: 2, text: 'Created an auction: "Vintage Car Auction".', date: '2024-09-27 14:30' },
  ]);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser && storedUser.email && storedUser.id) {
      fetchUserData(storedUser.email, storedUser.id);
    } else {
      alert('No user data found in local storage. Please log in.');
    }
  }, []);

  const fetchUserData = async (email, userID) => {
    try {
      const response = await fetch('/api/getUserData', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, userID }),
      });

      if (response.ok) {
        const data = await response.json();
        setUserData(data);
        setMaskedPassword('*'.repeat(data.password.length));
      } else {
        console.error('Failed to fetch user data');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/updateUserData', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        alert('Profile updated successfully!');
      } else {
        console.error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <div className="container">
      <h1>Profile</h1>
      {/* Profile Picture Section */}
      <div className="profile-picture-section">
        <img
          src="https://via.placeholder.com/100"
          alt="Profile"
          className="profile-picture"
        />
        <button className="upload-btn">Change Picture</button>
      </div>

      <form onSubmit={handleUpdate}>
        <div className="form-group">
          <label>Username:</label>
          <input
            type="text"
            value={userData.username}
            onChange={(e) => setUserData({ ...userData, username: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={userData.email}
            onChange={(e) => setUserData({ ...userData, email: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>New Password:</label>
          <input
            type="password"
            value={userData.password}
            onChange={(e) => setUserData({ ...userData, password: e.target.value })}
            placeholder="Leave blank to keep current password"
          />
        </div>
        <button type="submit">Update Profile</button>
      </form>

      <div className="info">
        <h2>Your Info:</h2>
        <p>
          <strong>Username:</strong> {userData.username}
        </p>
        <p>
          <strong>Email:</strong> {userData.email}
        </p>
        <p>
          <strong>Password:</strong> {showPassword ? userData.password : maskedPassword}
          <button onClick={() => setShowPassword(!showPassword)} className="toggle-password-btn">
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </p>
      </div>

      {/* Activity Feed */}
      <div className="activity-feed">
        <h3>Recent Activities</h3>
        <ul>
          {activities.map((activity) => (
            <li key={activity.id}>
              <span>{activity.date}</span>
              <p>{activity.text}</p>
            </li>
          ))}
        </ul>
      </div>

      <style jsx>{`
        .container {
          max-width: 600px;
          margin: 2rem auto;
          margin-top: 10rem;
          padding: 1.5rem;
          border: 1px solid #ccc;
          border-radius: 8px;
          background-color: #fff;
          box-shadow: 10px 10px 10px;
          background: linear-gradient(120deg, #e0c3fc 0%, #8ec5fc 100%);
          color: #333;
        }
        form {
          display: flex;
          flex-direction: column;
          margin-top: 1rem;
        }
        .form-group {
          margin-bottom: 1rem;
        }
        label {
          font-weight: bold;
          margin-bottom: 0.5rem;
          display: inline-block;
        }
        input {
          width: 100%;
          padding: 0.6rem;
          border: 1px solid #ccc;
          border-radius: 4px;
          box-sizing: border-box;
        }
        input:focus {
          border-color: #8ec5fc;
          outline: none;
          box-shadow: 0 0 5px rgba(142, 197, 252, 0.5);
        }
        button {
          background-color: #28a745;
          color: white;
          border: none;
          padding: 0.6rem 1.2rem;
          cursor: pointer;
          border-radius: 4px;
          transition: background-color 0.3s;
        }
        button:hover {
          background-color: #218838;
        }
        .info {
          margin-top: 2rem;
          padding: 1rem;
          border: 1px dashed #ccc;
          border-radius: 4px;
          background-color: #fafafa;
        }
        .toggle-password-btn {
          margin-left: 10px;
          padding: 2px 6px;
          cursor: pointer;
          background-color: transparent;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 0.9rem;
        }
        .toggle-password-btn:hover {
          background-color: #f0f0f0;
        }
        .profile-picture-section {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .profile-picture {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid #8ec5fc;
        }
        .upload-btn {
          background-color: #6c63ff;
          color: #fff;
          border: none;
          padding: 0.5rem 1rem;
          cursor: pointer;
          border-radius: 4px;
          transition: background-color 0.3s;
        }
        .upload-btn:hover {
          background-color: #574b90;
        }
        .activity-feed {
          margin-top: 2rem;
          padding: 1rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          background-color: #f5f5f5;
        }
        .activity-feed h3 {
          margin-bottom: 1rem;
        }
        .activity-feed ul {
          list-style-type: none;
          padding: 0;
        }
        .activity-feed li {
          margin-bottom: 1rem;
          padding: 0.5rem 0;
          border-bottom: 1px solid #ddd;
        }
        .activity-feed li span {
          display: block;
          font-size: 0.85rem;
          color: #888;
          margin-bottom: 0.2rem;
        }
      `}</style>
    </div>
  );
};

export default Profile;
