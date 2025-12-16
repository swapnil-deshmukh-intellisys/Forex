import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Navbar from '../Navbar';
import { renderWithProviders } from '../../test/utils/testUtils';

describe('Navbar Component', () => {
  const defaultProps = {
    onSignInClick: vi.fn(),
    onAboutUsClick: vi.fn(),
    onContactUsClick: vi.fn(),
    onHomeClick: vi.fn(),
    onAdminClick: vi.fn(),
    onAccountsClick: vi.fn(),
    currentPage: 'home',
    userEmail: '',
    adminEmail: '',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders navbar with logo', () => {
    renderWithProviders(<Navbar {...defaultProps} />);
    expect(screen.getByAltText('Zerofx.club')).toBeInTheDocument();
  });

  it('calls onHomeClick when logo is clicked', () => {
    renderWithProviders(<Navbar {...defaultProps} currentPage="about" />);
    const logo = screen.getByAltText('Zerofx.club');
    fireEvent.click(logo);
    expect(defaultProps.onHomeClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onHomeClick when already on home page', () => {
    renderWithProviders(<Navbar {...defaultProps} currentPage="home" />);
    const logo = screen.getByAltText('Zerofx.club');
    fireEvent.click(logo);
    expect(defaultProps.onHomeClick).not.toHaveBeenCalled();
  });

  it('renders sign in button when user is not logged in', () => {
    renderWithProviders(<Navbar {...defaultProps} />);
    expect(screen.getByText(/sign in/i)).toBeInTheDocument();
  });

  it('calls onSignInClick when sign in button is clicked', () => {
    renderWithProviders(<Navbar {...defaultProps} />);
    const signInButton = screen.getByText(/sign in/i);
    fireEvent.click(signInButton);
    expect(defaultProps.onSignInClick).toHaveBeenCalledTimes(1);
  });

  it('renders user email when user is logged in', () => {
    renderWithProviders(<Navbar {...defaultProps} userEmail="test@example.com" />);
    expect(screen.getByText(/test@example.com/i)).toBeInTheDocument();
  });

  it('renders admin email when admin is logged in', () => {
    renderWithProviders(<Navbar {...defaultProps} adminEmail="admin@example.com" />);
    expect(screen.getByText(/admin@example.com/i)).toBeInTheDocument();
  });

  it('calls onAboutUsClick when About Us link is clicked', () => {
    renderWithProviders(<Navbar {...defaultProps} />);
    const aboutLink = screen.getByText(/about us/i);
    fireEvent.click(aboutLink);
    expect(defaultProps.onAboutUsClick).toHaveBeenCalledTimes(1);
  });

  it('calls onContactUsClick when Contact link is clicked', () => {
    renderWithProviders(<Navbar {...defaultProps} />);
    const contactLink = screen.getByText(/contact/i);
    fireEvent.click(contactLink);
    expect(defaultProps.onContactUsClick).toHaveBeenCalledTimes(1);
  });

  it('renders theme toggle button', () => {
    renderWithProviders(<Navbar {...defaultProps} />);
    const themeButton = screen.getByRole('button', { name: /theme/i });
    expect(themeButton).toBeInTheDocument();
  });

  it('shows scrolled state when window is scrolled', () => {
    renderWithProviders(<Navbar {...defaultProps} />);
    // Simulate scroll
    Object.defineProperty(window, 'scrollY', { value: 100, writable: true });
    fireEvent.scroll(window);
    // Navbar should have scrolled styling
    expect(window.scrollY).toBe(100);
  });
});

