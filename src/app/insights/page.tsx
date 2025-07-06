'use client';
import { useEffect, useState } from 'react';
import './insight.css';

type Task = { id: string; text: string; completed: boolean };

export default function InsightsPage() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('tasks');
    if (stored) setTasks(JSON.parse(stored));
  }, []);

  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const percentage = total ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="insights-page">
      <h1>📊 Insights</h1>
      <ul>
        <li>Total tasks: {total}</li>
        <li>Completed: {completed}</li>
        <li>Remaining: {total - completed}</li>
        <li>Completion rate: {percentage}%</li>
      </ul>
    </div>
  );
}
