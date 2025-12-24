import { redirect } from 'next/navigation';

export default function RootPage() {
  // In a real app, you would check cookies here.
  // If session exists -> redirect('/dashboard')
  // If no session -> redirect('/login')

  redirect('/login');
}