// app/layout.tsx
import './globals.css';
import Link from 'next/link';

export const metadata = {
  title: 'Task Manager',
  description: 'Manage your tasks easily',
};



export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head />
      <body>
        <header>
          <h1>🧠 My Site</h1>
          <nav>
            <Link href="/">Home</Link> |{' '}
            <Link href="/tasks">Tasks</Link> |{' '}
            <Link href="/insights">Stats</Link>
          </nav>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
