import { useState, useMemo } from 'react';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import { subDays, subMonths, isAfter } from 'date-fns';
import './ExpenseChart.css';

const OPTIONS = [
  { label: 'Last 7 days', fn: () => subDays(new Date(), 7) },
  { label: 'Last 15 days', fn: () => subDays(new Date(), 15) },
  { label: 'Last 30 days', fn: () => subDays(new Date(), 30) },
  { label: 'Last 3 months', fn: () => subMonths(new Date(), 3) },
  { label: 'Last 6 months', fn: () => subMonths(new Date(), 6) },
  { label: 'Last 1 year', fn: () => subMonths(new Date(), 12) },
];

export default function ExpenseChart({ expenses }) {
  const [range, setRange] = useState(OPTIONS[2]); // default 30 days

  const filtered = useMemo(() => {
    const cutoff = range.fn();
    return expenses.filter(e => isAfter(new Date(e.date), cutoff));
  }, [range, expenses]);

  const categorySum = useMemo(() => {
    return filtered.reduce((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + e.amount;
      return acc;
    }, {});
  }, [filtered]);

  const data = useMemo(() => ({
    labels: Object.keys(categorySum),
    datasets: [{
      data: Object.values(categorySum),
      backgroundColor: [
        '#4dc9f6','#f67019','#f53794','#537bc4',
        '#acc236','#166a8f','#00a950','#58595b','#8549ba'
      ]
    }]
  }), [categorySum]);

  return (
    <div style={{ maxWidth: '400px', margin: 'auto' }}>
      <h4>
        Category-wise Expenses<br />
        <select
          value={range.label}
          onChange={e =>
            setRange(OPTIONS.find(o => o.label === e.target.value))
          }
        >
          {OPTIONS.map(o => <option key={o.label}>{o.label}</option>)}
        </select>
      </h4>
      <Pie data={data} />
    </div>
  );
}
