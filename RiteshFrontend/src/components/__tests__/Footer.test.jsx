import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Footer from '../Footer';
import { renderWithProviders } from '../../test/utils/testUtils';

describe('Footer Component', () => {
  const defaultProps = {
    onAboutUsClick: vi.fn(),
    onContactUsClick: vi.fn(),
  };

  it('renders footer with logo', () => {
    renderWithProviders(<Footer {...defaultProps} />);
    expect(screen.getByAltText('Zerofx.club')).toBeInTheDocument();
  });

  it('renders company links section', () => {
    renderWithProviders(<Footer {...defaultProps} />);
    expect(screen.getByText('About Us')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
  });

  it('calls onAboutUsClick when About Us link is clicked', () => {
    renderWithProviders(<Footer {...defaultProps} />);
    const aboutLink = screen.getByText('About Us');
    fireEvent.click(aboutLink);
    expect(defaultProps.onAboutUsClick).toHaveBeenCalledTimes(1);
  });

  it('calls onContactUsClick when Contact link is clicked', () => {
    renderWithProviders(<Footer {...defaultProps} />);
    const contactLink = screen.getByText('Contact');
    fireEvent.click(contactLink);
    expect(defaultProps.onContactUsClick).toHaveBeenCalledTimes(1);
  });

  it('renders trading links section', () => {
    renderWithProviders(<Footer {...defaultProps} />);
    expect(screen.getByText('Forex Trading')).toBeInTheDocument();
    expect(screen.getByText('Crypto Trading')).toBeInTheDocument();
  });

  it('renders platform links section', () => {
    renderWithProviders(<Footer {...defaultProps} />);
    expect(screen.getByText('MT5 Platform')).toBeInTheDocument();
    expect(screen.getByText('Web Terminal')).toBeInTheDocument();
  });

  it('renders support links section', () => {
    renderWithProviders(<Footer {...defaultProps} />);
    expect(screen.getByText('Help Center')).toBeInTheDocument();
    expect(screen.getByText('FAQ')).toBeInTheDocument();
  });

  it('renders copyright text', () => {
    renderWithProviders(<Footer {...defaultProps} />);
    expect(screen.getByText(/copyright/i)).toBeInTheDocument();
  });
});

