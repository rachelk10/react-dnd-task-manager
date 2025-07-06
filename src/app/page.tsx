'use client';
import Link from 'next/link';
import './home.css';

export default function HomePage() {
  return (
    <div className="home-page">
      <h1>Welcome to the Task Manager App 🧠</h1>
      <p style={{'color': 'white', 'fontSize': 'medium', 'textAlign': 'center'}}>;
Organize your day, prioritize your goals, and boost productivity.</p>

      <div className="navigation-buttons">
        <Link href="/tasks">
          <button>Go to Tasks 📝</button>
        </Link>
        <Link href="/insights">
          <button>View Insights 📊</button>
        </Link>
      </div>
    </div>
  );
}
