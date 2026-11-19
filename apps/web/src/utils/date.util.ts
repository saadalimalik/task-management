// Due dates are calendar days. They are stored as UTC midnight and always read back in UTC,
// so the server render and every browser show the same day.
const dueDateFormat = new Intl.DateTimeFormat('en', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
});

export const toDateInputValue = (isoDateTime: string | null): string =>
    isoDateTime ? isoDateTime.slice(0, 10) : '';

export const toDueDateTime = (dateInputValue: string): string => `${dateInputValue}T00:00:00.000Z`;

export const formatDueDate = (isoDateTime: string): string =>
    dueDateFormat.format(new Date(isoDateTime));

// ponytail: "today" is the UTC day, so a task can flip to overdue a few hours early or late
// for users far from UTC. Store a per-user time zone if that matters.
export const isOverdue = (isoDateTime: string | null, now: Date = new Date()): boolean =>
    isoDateTime !== null && toDateInputValue(isoDateTime) < now.toISOString().slice(0, 10);
