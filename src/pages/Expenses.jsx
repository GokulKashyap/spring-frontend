import { useEffect, useState } from 'react';
import axios from 'axios';

function Expenses() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('https://spring-backend-8.onrender.com/expenses', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMessage(res.data);
      } catch (err) {
        setMessage('Unauthorized or error occurred');
      }
    };

    fetchExpenses();
  }, []);

  return (
    <div>
      <h2>Your Expenses</h2>
      <p>{message}</p>
    </div>
  );
}

export default Expenses;
