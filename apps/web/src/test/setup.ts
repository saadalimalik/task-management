import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

afterEach(cleanup);

// jsdom has no modal <dialog> support.
HTMLDialogElement.prototype.showModal = function showModal() {
    this.setAttribute('open', '');
};
HTMLDialogElement.prototype.close = function close() {
    this.removeAttribute('open');
    this.dispatchEvent(new Event('close'));
};

// jsdom hides [popover] elements but has no Popover API to show them.
HTMLElement.prototype.showPopover = function showPopover() {
    this.style.display = 'block';
};
HTMLElement.prototype.hidePopover = function hidePopover() {
    this.style.display = '';
};
