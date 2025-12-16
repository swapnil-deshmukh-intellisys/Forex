import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import AdminPanel from '../AdminPanel';
import { renderWithProviders } from '../../test/utils/testUtils';

describe('AdminPanel Component', () => {
  const defaultProps = {
    adminEmail: 'admin@example.com',
    onSignOut: vi.fn(),
    onBack: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.setItem('adminToken', 'mock-admin-token');
    sessionStorage.setItem('adminEmail', 'admin@example.com');
  });

  it('renders admin panel when authenticated', () => {
    renderWithProviders(<AdminPanel {...defaultProps} />);
    expect(screen.getByText(/admin|dashboard/i)).toBeInTheDocument();
  });

  it('renders admin navigation', () => {
    renderWithProviders(<AdminPanel {...defaultProps} />);
    expect(screen.getByText(/users|accounts|deposits|withdrawals/i)).toBeInTheDocument();
  });
});

