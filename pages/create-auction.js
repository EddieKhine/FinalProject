// pages/create-auction.js
import { useState } from 'react';

const CreateAuction = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [photo, setPhoto] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('startTime', startTime);
    formData.append('endTime', endTime);
    const userId = localStorage.getItem('userId'); // Assuming userId is stored in localStorage
    formData.append('userId', userId);
    
    // Append photo if it exists
    if (photo) {
      formData.append('photo', photo);
    }

    try {
      const response = await fetch('/api/auctions', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to create auction');
      }

      const data = await response.json();
      console.log('Auction created:', data);
      alert('Auction created successfully!');
      // Optionally, you could redirect the user or reset the form here
    } catch (error) {
      console.error(error);
      alert('Failed to create auction');
    }
  };

  return (
    <div>
      <h1>Create Auction</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Auction Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <input
          type="datetime-local"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          required
        />
        <input
          type="datetime-local"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          required
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setPhoto(e.target.files[0])}
          required
        />
        <button type="submit">Create Auction</button>
      </form>
    </div>
  );
};

export default CreateAuction;
