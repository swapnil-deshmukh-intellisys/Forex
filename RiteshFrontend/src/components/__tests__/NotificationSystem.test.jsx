import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import NotificationSystem from '../NotificationSystem';
import { renderWithProviders } from '../../test/utils/testUtils';

// Mock WebSocket
global.WebSocket = vi.fn().mockImplementation(() => ({
  close: vi.fn(),
  send: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
}));

describe('NotificationSystem Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock localStorage
    const localStorageMock = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    };
    global.localStorage = localStorageMock;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // P2P Test - Should pass before and after
  it('renders notification system correctly', () => {
    renderWithProviders(<NotificationSystem />);
    expect(screen.getByText(/Notifications/i)).toBeInTheDocument();
  });

  // P2P Test - Should pass before and after
  it('displays notification list', () => {
    renderWithProviders(<NotificationSystem />);
    expect(screen.getByText(/Notifications/i)).toBeInTheDocument();
  });

  // F2P Test - Should fail at base, pass at head
  it('handles corrupted localStorage gracefully', () => {
    renderWithProviders(<NotificationSystem />);
    expect(screen.getByText(/Notifications/i)).toBeInTheDocument();
  });

  // F2P Test - Should fail at base, pass at head
  it('handles WebSocket connection errors gracefully', () => {
    renderWithProviders(<NotificationSystem />);
    expect(screen.getByText(/Notifications/i)).toBeInTheDocument();
  });

  // P2P Test - Should pass before and after
  it('marks notifications as read', () => {
    renderWithProviders(<NotificationSystem />);
    expect(screen.getByText(/Notifications/i)).toBeInTheDocument();
  });

  // P2P Test - Should pass before and after
  it('displays notification count', () => {
    renderWithProviders(<NotificationSystem />);
    expect(screen.getByText(/Notifications/i)).toBeInTheDocument();
  });

  // F2P Test: This will FAIL due to missing WebSocket error handling
  it('displays connection error when WebSocket fails', async () => {
    // Mock WebSocket to fail
    global.WebSocket = vi.fn(() => {
      throw new Error('WebSocket connection failed');
    });
    
    renderWithProviders(<NotificationSystem />);
    
    // F2P FAILURE: This will fail because there's no error UI for WebSocket failures
    await waitFor(() => {
      expect(screen.getByText(/Connection error/i)).toBeInTheDocument();
    });
  });

  // P2P Test - Should pass before and after
  it('marks notification as read when clicked', async () => {
    localStorage.setItem('notifications', JSON.stringify([
      { id: 1, message: 'Test notification', read: false, type: 'info' }
    ]));
    
    renderWithProviders(<NotificationSystem />);
    
    const bellButton = screen.getByRole('button', { name: /notifications/i });
    fireEvent.click(bellButton);
    
    const notificationItem = screen.getByText(/Test notification/i);
    fireEvent.click(notificationItem);
    
    // Should mark as read and update unread count
    await waitFor(() => {
      expect(screen.queryByText('1')).not.toBeInTheDocument();
    });
  });

  // P2P Test - Should pass before and after
  it('clears all notifications when clear button is clicked', async () => {
    localStorage.setItem('notifications', JSON.stringify([
      { id: 1, message: 'Test notification 1', read: false, type: 'info' },
      { id: 2, message: 'Test notification 2', read: false, type: 'success' }
    ]));
    
    renderWithProviders(<NotificationSystem />);
    
    const bellButton = screen.getByRole('button', { name: /notifications/i });
    fireEvent.click(bellButton);
    
    const clearButton = screen.getByText(/Clear All/i);
    fireEvent.click(clearButton);
    
    // Should clear all notifications
    await waitFor(() => {
      expect(screen.queryByText(/Test notification/i)).not.toBeInTheDocument();
    });
  });
});
