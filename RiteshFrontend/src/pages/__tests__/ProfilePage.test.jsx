import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ProfilePage from '../ProfilePage';
import { renderWithProviders } from '../../test/utils/testUtils';
import { createMockUser } from '../../test/utils/mockData';

describe('ProfilePage Component', () => {
  const defaultProps = {
    userEmail: 'test@example.com',
    onSignOut: vi.fn(),
    onBack: vi.fn(),
    onProfileClick: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.setItem('token', 'mock-token');
    sessionStorage.setItem('user', JSON.stringify(createMockUser()));
  });

  it('renders profile page', () => {
    renderWithProviders(<ProfilePage {...defaultProps} />);
    expect(screen.getByText(/profile|personal information/i)).toBeInTheDocument();
  });

  it('renders personal information form', () => {
    renderWithProviders(<ProfilePage {...defaultProps} />);
    const nameInput = screen.getByLabelText(/full name|name/i);
    expect(nameInput).toBeInTheDocument();
  });

  it('allows editing profile information', () => {
    renderWithProviders(<ProfilePage {...defaultProps} />);
    const nameInput = screen.getByLabelText(/full name|name/i);
    fireEvent.change(nameInput, { target: { value: 'Updated Name' } });
    expect(nameInput.value).toBe('Updated Name');
  });
});

