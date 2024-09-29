import { useState, useEffect } from 'react';

const Profile = () => {
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    password: '',
    profilePicture: '',
  });
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState('');

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
        setUserData({
          username: data.username || '',
          email: data.email || '',
          password: '', // Don't fill password field for security reasons
          profilePicture: data.profilePicture || '',
        });
      } else {
        console.error('Failed to fetch user data');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('username', userData.username);
    formData.append('email', userData.email);
    formData.append('password', userData.password);
    if (profilePictureFile) {
      formData.append('profilePicture', profilePictureFile);
    }

    try {
      const response = await fetch('/api/updateUserData', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setUploadMessage('Profile updated successfully!');
        fetchUserData(userData.email, localStorage.getItem('user').id);
      } else {
        setUploadMessage('Failed to update profile.');
      }
    } catch (error) {
      setUploadMessage('Error updating profile.');
    }
  };

  const handleFileChange = (e) => {
    setProfilePictureFile(e.target.files[0]);
  };

  const getProfileImageUrl = () => {
    return userData.profilePicture
      ? `${window.location.origin}${userData.profilePicture}`
      : 'https://via.placeholder.com/100';
  };

  return (
    <div className="container">


      <form onSubmit={handleUpdate}>
        <div className="form-group">
          <label>Username:</label>
          <input
            type="text"
            value={userData.username || ''}
            onChange={(e) => setUserData({ ...userData, username: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={userData.email || ''}
            onChange={(e) => setUserData({ ...userData, email: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>New Password:</label>
          <input
            type="password"
            value={userData.password || ''}
            onChange={(e) => setUserData({ ...userData, password: e.target.value })}
            placeholder="Leave blank to keep current password"
          />
        </div>
        <button type="submit">Update Profile</button>
      </form>
      {uploadMessage && <p>{uploadMessage}</p>}
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
          border: none;
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
      `}</style>
    </div>
  );
};

export default Profile;
