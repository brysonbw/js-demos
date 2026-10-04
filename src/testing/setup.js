// This file ensures that jest-dom matchers like toBeInTheDocument are available globally in tests.
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// jsdom does not implement dialog methods
HTMLDialogElement.prototype.showModal = vi.fn();
HTMLDialogElement.prototype.close = vi.fn();
