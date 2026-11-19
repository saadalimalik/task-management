import { Link } from '@tanstack/react-router';
import { buttonClass } from '~/components/Button';

export const NotFound = () => (
    <main id="main" className="wrap flex min-h-dvh flex-col items-start justify-center gap-4 py-16">
        <h1 className="text-4xl tracking-tight">Page not found</h1>
        <p className="max-w-prose text-muted">
            Nothing lives at this address. Your tasks are on the home page.
        </p>
        <Link to="/" className={buttonClass('primary')}>
            Go to your tasks
        </Link>
    </main>
);
