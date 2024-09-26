// pages/register.js
import { useState } from 'react';
import { useRouter } from 'next/router';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      router.push('/login'); // Redirect to login after successful registration
    } else {
      // Handle error
      console.error('Registration failed');
    }
  };

  return (
    <form onSubmit={handleRegister}>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Register</button>
    </form>
  );
};

export default Register;
