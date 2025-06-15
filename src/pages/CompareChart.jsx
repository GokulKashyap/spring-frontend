// CompareChart.jsx
import { useMemo, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

function getMonthYear(dateString) {
  const date = new Date(dateString);
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
}

function groupByCategory(expenses) {
  return expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {});
}

export default function CompareChart({ expenses }) {
  const allMonths = useMemo(() => {
    const unique = new Set(expenses.map(e => getMonthYear(e.date)));
    return Array.from(unique).sort((a, b) => new Date(a) - new Date(b));
  }, [expenses]);

  const [month1, setMonth1] = useState(allMonths[0]);
  const [month2, setMonth2] = useState(allMonths[1] || allMonths[0]);

  const filtered1 = expenses.filter(e => getMonthYear(e.date) === month1);
  const filtered2 = expenses.filter(e => getMonthYear(e.date) === month2);

  const sum1 = groupByCategory(filtered1);
  const sum2 = groupByCategory(filtered2);

  const allCategories = Array.from(new Set([...Object.keys(sum1), ...Object.keys(sum2)]));

  const data = {
    labels: allCategories,
    datasets: [
      {
        label: `Expenses in ${month1}`,
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        data: allCategories.map(cat => sum1[cat] || 0)
      },
      {
        label: `Expenses in ${month2}`,
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        data: allCategories.map(cat => sum2[cat] || 0)
      }
    ]
  };

  return (
    <div style={{ maxWidth: 600, margin: '20px auto' }}>
      <h3>Compare Two Months</h3>
      <div>
        <label>Month 1: </label>
        <select value={month1} onChange={e => setMonth1(e.target.value)}>
          {allMonths.map(m => <option key={m}>{m}</option>)}
        </select>
        &nbsp;&nbsp;
        <label>Month 2: </label>
        <select value={month2} onChange={e => setMonth2(e.target.value)}>
          {allMonths.map(m => <option key={m}>{m}</option>)}
        </select>
      </div>
      <Bar data={data} />
    </div>
  );
}
