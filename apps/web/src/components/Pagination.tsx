import { Link } from '@tanstack/react-router';
import { buttonClass } from '~/components/Button';
import { ChevronLeftIcon, ChevronRightIcon } from '~/components/Icons';

type PaginationProps = { page: number; pages: number };

export const Pagination = ({ page, pages }: PaginationProps) => {
    if (pages <= 1) return null;

    return (
        <nav aria-label="Pagination" className="mt-6 flex items-center justify-between gap-3">
            {page > 1 ? (
                <Link
                    to="/"
                    search={(previous) => ({
                        ...previous,
                        page: page - 1 === 1 ? undefined : page - 1,
                    })}
                    className={buttonClass('secondary', 'px-4')}
                >
                    <ChevronLeftIcon />
                    <span className="max-[22rem]:sr-only">Previous</span>
                </Link>
            ) : (
                <span aria-hidden="true" />
            )}
            <p className="text-center text-muted" aria-live="polite">
                Page {page} of {pages}
            </p>
            {page < pages ? (
                <Link
                    to="/"
                    search={(previous) => ({ ...previous, page: page + 1 })}
                    className={buttonClass('secondary', 'px-4')}
                >
                    <span className="max-[22rem]:sr-only">Next</span>
                    <ChevronRightIcon />
                </Link>
            ) : (
                <span aria-hidden="true" />
            )}
        </nav>
    );
};
