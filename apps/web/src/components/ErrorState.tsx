import { useRouter } from '@tanstack/react-router';
import type { ErrorComponentProps } from '@tanstack/react-router';
import { Button } from '~/components/Button';
import { toErrorMessage } from '~/utils/api-error.util';

export const ErrorState = ({ error, reset }: ErrorComponentProps) => {
    const router = useRouter();

    const retry = () => {
        reset();
        void router.invalidate();
    };

    return (
        <main
            id="main"
            className="wrap flex min-h-dvh flex-col items-start justify-center gap-4 py-16"
        >
            <div role="alert">
                <h1 className="text-4xl tracking-tight">Tasks could not load</h1>
                <p className="mt-2 max-w-prose text-muted">{toErrorMessage(error)}</p>
            </div>
            <Button variant="primary" onClick={retry}>
                Try again
            </Button>
        </main>
    );
};
