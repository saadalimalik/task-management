import { createPortal } from 'react-dom';
import { Toaster as SonnerToaster } from 'sonner';
import { useToastHost } from '~/lib/toast-host';
import type { ThemePreference } from '~/types/theme.type';

type ToasterProps = { theme: ThemePreference };

export const Toaster = ({ theme }: ToasterProps) => {
    const host = useToastHost();

    const toaster = (
        <SonnerToaster
            position="top-center"
            theme={theme}
            richColors
            closeButton
            offset={{ top: 'calc(env(safe-area-inset-top) + 1rem)' }}
            mobileOffset={{ top: 'calc(env(safe-area-inset-top) + 0.75rem)' }}
            toastOptions={{ style: { fontFamily: 'inherit', fontSize: '1rem' } }}
        />
    );

    return host ? createPortal(toaster, host) : toaster;
};
