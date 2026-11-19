import { Button } from '~/components/Button';

type DeleteTaskConfirmProps = {
    title: string;
    pending: boolean;
    onConfirm: () => void;
    onCancel: () => void;
};

export const DeleteTaskConfirm = ({
    title,
    pending,
    onConfirm,
    onCancel,
}: DeleteTaskConfirmProps) => (
    <div className="flex flex-col gap-6">
        <p>
            “{title}” will be removed for good.{' '}
            <span className="text-muted">This cannot be undone.</span>
        </p>
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button onClick={onCancel} data-autofocus="">
                Keep task
            </Button>
            <Button variant="danger" disabled={pending} onClick={onConfirm}>
                {pending ? 'Deleting…' : 'Delete task'}
            </Button>
        </div>
    </div>
);
