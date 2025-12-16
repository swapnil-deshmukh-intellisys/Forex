import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Header from '../Header';

describe('Header Component', () => {
  const defaultProps = {
    userEmail: 'test@example.com',
    onSignOut: vi.fn(),
    onProfileClick: vi.fn(),
    onBack: vi.fn(),
    showBackButton: false,
    isAdmin: false,
    onHomeClick: vi.fn(),
    onAccountsClick: vi.fn(),
    pendingRequests: { deposits: [], withdrawals: [] },
  };

  it('renders header with user email', () => {
    render(<Header {...defaultProps} />);
    // Adjust selector based on actual Header implementation
    expect(screen.getByText(/test@example.com/i)).toBeInTheDocument();
  });

  it('calls onSignOut when sign out button is clicked', () => {
    render(<Header {...defaultProps} />);
    const signOutButton = screen.getByRole('button', { name: /sign out/i });
    fireEvent.click(signOutButton);
    expect(defaultProps.onSignOut).toHaveBeenCalledTimes(1);
  });

  it('shows back button when showBackButton is true', () => {
    render(<Header {...defaultProps} showBackButton={true} />);
    const backButton = screen.getByRole('button', { name: /back/i });
    expect(backButton).toBeInTheDocument();
  });

  it('calls onBack when back button is clicked', () => {
    render(<Header {...defaultProps} showBackButton={true} />);
    const backButton = screen.getByRole('button', { name: /back/i });
    fireEvent.click(backButton);
    expect(defaultProps.onBack).toHaveBeenCalledTimes(1);
  });
});

