import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
      <div className="max-w-md w-full text-center">
        <h1 className="text-9xl font-bold text-primary opacity-20">404</h1>
        <div className="relative -mt-20">
          <h2 className="text-3xl font-bold text-neutral-900 mb-4">Page Not Found</h2>
          <p className="text-neutral-600 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Link href="/dashboard">
            <Button size="lg">Return to Dashboard</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
