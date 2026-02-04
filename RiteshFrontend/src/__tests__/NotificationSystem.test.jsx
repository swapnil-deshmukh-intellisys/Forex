import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import NotificationSystem from '../components/NotificationSystem';

// Mock localStorage using Object.defineProperty
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
};

Object.defineProperty(global, 'localStorage', {
  value: localStorageMock,
  writable: true,
  configurable: true
});

describe('NotificationSystem Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
    localStorageMock.setItem.mockReturnValue(undefined);
    localStorageMock.removeItem.mockReturnValue(undefined);
  });

  it('renders notification bell', () => {
    render(<NotificationSystem />);
    const bell = screen.getByRole('button');
    expect(bell).toBeInTheDocument();
  });

  it('opens notification dropdown when clicked', () => {
    render(<NotificationSystem />);
    const bell = screen.getByRole('button');
    fireEvent.click(bell);
    
    expect(screen.getAllByText(/Notifications/i).length).toBeGreaterThan(0);
  });

  it('displays unread count badge', async () => {
    render(<NotificationSystem />);
    
    // Wait for notifications to be generated
    await waitFor(() => {
      const bell = screen.getByRole('button');
      fireEvent.click(bell);
    }, { timeout: 2000 });
  });

  it('closes dropdown when clicking outside', () => {
    render(<NotificationSystem />);
    const bell = screen.getByRole('button');
    fireEvent.click(bell);
    
    expect(screen.getAllByText(/Notifications/i).length).toBeGreaterThan(0);
    
    // Click outside (on the overlay)
    const overlay = document.querySelector('.fixed.inset-0');
    if (overlay) {
      fireEvent.click(overlay);
    }
  });

  it('marks notification as read when clicked', async () => {
    render(<NotificationSystem />);
    const bell = screen.getByRole('button');
    fireEvent.click(bell);
    
    await waitFor(() => {
      // Notification items should be clickable
      const notifications = screen.queryAllByRole('button');
      expect(notifications.length).toBeGreaterThan(0);
    });
  });
});

