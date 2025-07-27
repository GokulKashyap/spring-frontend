import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import CalendarView from './CalendarView';
import ExpenseChart from './ExpenseChart';
import './Dashboard.css';
import { ThemeContext } from './ThemeContext';
import CompareChart from './CompareChart';
function Dashboard({ onLogout }) {
  const [expenses, setExpenses] = useState([]);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: '',
    date: new Date().toLocaleDateString('en-CA'),
  });

  const { darkMode, toggle } = useContext(ThemeContext);

  const token = localStorage.getItem('token');

  const fetchExpenses = async () => {
    try {
      const res = await axios.get('https://spring-backend-8.onrender.com/expenses', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExpenses(res.data);
    } catch {
      setError('Failed to fetch expenses. Please try again.');
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`https://spring-backend-8.onrender.com/expenses/${editingId}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIsEditing(false);
        setEditingId(null);
      } else {
        await axios.post('https://spring-backend-8.onrender.com/expenses', formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      setFormData({
        title: '',
        amount: '',
        category: '',
        date: selectedDate.toLocaleDateString('en-CA'),
      });
      fetchExpenses();
    } catch {
      setError('Failed to submit expense.');
    }
  };

  const handleEdit = (exp) => {
    setFormData({
      title: exp.title,
      amount: exp.amount,
      category: exp.category,
      date: exp.date
    });
    setIsEditing(true);
    setEditingId(exp.id);
    setSelectedDate(new Date(exp.date));
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://spring-backend-8.onrender.com/expenses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchExpenses();
    } catch {
      setError('Failed to delete expense.');
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const filteredExpenses = expenses.filter(
    e => new Date(e.date).toDateString() === selectedDate.toDateString()
  );

  return (
    <div className={darkMode ? 'dark-theme' : 'light-theme'}>
      <div className="dashboard-header">
        <button onClick={toggle} className="theme-toggle-btn">
          {darkMode ? '🌞 Light Mode' : '🌙 Dark Mode'}
        </button>
      </div>

      <div className="dashboard-container">
        <div className="left-panel">
          <h2>{selectedDate.toDateString()}</h2>
          <form onSubmit={handleSubmit} className="expense-form">
            <input type="text" name="title" placeholder="Title" value={formData.title} onChange={handleChange} required />
            <input type="number" name="amount" placeholder="Amount" value={formData.amount} onChange={handleChange} required />
            
            <select
              name="category"
              value={formData.category}
              onChange={(e) => {
                const value = e.target.value;
                if (value === 'Other') {
                  setFormData(prev => ({ ...prev, category: '' }));
                } else {
                  setFormData(prev => ({ ...prev, category: value }));
                }
              }}
              required
            >
              <option value="">--Select Category--</option>
              <option value="Food">Food</option>
              <option value="Rent">Rent</option>
              <option value="Transport">Transport</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Health">Health</option>
              <option value="Shopping">Shopping</option>
              <option value="Utilities">Utilities</option>
              <option value="Education">Education</option>
              <option value="Travel">Travel</option>
              <option value="Sports">Sports</option>
              <option value="Miscellaneous">Miscellaneous</option>
              <option value="Other">Other</option>
            </select>

            {formData.category === '' && (
              <input
                type="text"
                name="category"
                placeholder="Enter custom category"
                value={formData.category}
                onChange={handleChange}
                required
              />
            )}

            <input type="date" name="date" value={formData.date} onChange={handleChange} required />
            <button type="submit">{isEditing ? 'Update' : 'Add'} Expense</button>
          </form>

          {error && <p className="error">{error}</p>}

          <table className="expense-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Amount</th>
                <th>Category</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.length === 0 ? (
                <tr><td colSpan="5">No expenses for this date.</td></tr>
              ) : (
                filteredExpenses.map((exp, i) => (
                  <tr key={i}>
                    <td>{exp.title}</td>
                    <td>₹{exp.amount}</td>
                    <td>{exp.category}</td>
                    <td>{exp.date}</td>
                    <td>
                      <button onClick={() => handleEdit(exp)}>Edit</button>
                      <button onClick={() => handleDelete(exp.id)}>Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <br />
          <button onClick={onLogout}>Logout</button>
                {expenses.length > 0 && (
  <CompareChart expenses={expenses} />
)}
        </div>



        <div className="right-panel">
          <CalendarView
            selectedDate={selectedDate}
            onChange={(date) => {
              setSelectedDate(date);
              setFormData(prev => ({
                ...prev,
                date: date.toLocaleDateString('en-CA')
              }));
            }}
            expenses={expenses}
          />
          {expenses.length > 0 && (
            <ExpenseChart expenses={expenses} />
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
