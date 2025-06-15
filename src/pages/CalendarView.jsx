import { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { subDays, subMonths, isAfter, startOfMonth, endOfMonth } from 'date-fns';
import './CalendarView.css';

function CalendarView({ selectedDate, onChange, expenses }) {
  const [expensesByDate, setExpensesByDate] = useState({});
  const [dailyTotal, setDailyTotal] = useState(0);
  const [monthlyLimit, setMonthlyLimit] = useState(5000);
  const [monthlySpent, setMonthlySpent] = useState(0);

  useEffect(() => {
    const grouped = {};
    expenses.forEach(e => {
      const key = new Date(e.date).toDateString();
      grouped[key] = grouped[key] || [];
      grouped[key].push(e);
    });
    setExpensesByDate(grouped);
  }, [expenses]);

  useEffect(() => {
    const key = selectedDate.toDateString();
    setDailyTotal(
      (expensesByDate[key] || []).reduce((s, e) => s + e.amount, 0)
    );

    const ms = selectedDate.getMonth();
    const ys = selectedDate.getFullYear();

    const currMonthExpenses = expenses
      .filter(e => {
        const d = new Date(e.date);
        return d.getMonth() === ms && d.getFullYear() === ys;
      })
      .reduce((s, e) => s + e.amount, 0);

    setMonthlySpent(currMonthExpenses);
  }, [selectedDate, expensesByDate]);

  const today = new Date();
  const isCurrentMonth =
    selectedDate.getMonth() === today.getMonth() &&
    selectedDate.getFullYear() === today.getFullYear();

  const tileContent = ({ date }) => {
    const key = date.toDateString();
    const total = (expensesByDate[key] || []).reduce((s, e) => s + e.amount, 0);
    return total > 0 ? (
      <span className="calendar-amount">₹{total}</span>
    ) : null;
  };

  const budgetUsedPercent = Math.round((monthlySpent / monthlyLimit) * 100);

  return (
    <div className="calendar-container">
      <h3>📅 Calendar View</h3>
      <Calendar
        onChange={onChange}
        value={selectedDate}
        maxDetail="month"
        tileDisabled={({ date }) => date > today}
        tileContent={tileContent}
      />

      <h4 style={{ marginTop: 20 }}>
        {selectedDate.toDateString()} — Spent: <b>₹{dailyTotal}</b>
      </h4>

      <div className="budget-box">
        <h4>
          Monthly Limit:
          {' '}
          {isCurrentMonth ? (
            <input
              type="number"
              value={monthlyLimit}
              onChange={e => setMonthlyLimit(Number(e.target.value))}
              style={{ width: '100px', marginLeft: '10px' }}
            />
          ) : (
            <span style={{ marginLeft: '10px' }}>₹{monthlyLimit}</span>
          )}
        </h4>

        <p>Total Spent This Month: ₹{monthlySpent}</p>

        <div className="budget-indicator">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: `${Math.min(budgetUsedPercent, 100)}%`,
                backgroundColor:
                  budgetUsedPercent < 80
                    ? 'green'
                    : budgetUsedPercent < 100
                      ? 'orange'
                      : 'red',
              }}
            />
          </div>
          <p className="progress-text">
            {budgetUsedPercent > 100
              ? `🚨 Budget exceeded by ₹${monthlySpent - monthlyLimit}`
              : `✅ ${budgetUsedPercent}% of your budget used`}
          </p>
        </div>

        {!isCurrentMonth && (
          <p style={{ marginTop: '10px' }}>
            {monthlySpent > monthlyLimit
              ? `❌ You spent more than the limit by ₹${monthlySpent - monthlyLimit}`
              : `🎉 You saved ₹${monthlyLimit - monthlySpent}`}
          </p>
        )}
      </div>
    </div>
  );
}

export default CalendarView;
