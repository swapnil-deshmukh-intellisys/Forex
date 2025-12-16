import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ContactUs from '../ContactUs';
import { renderWithProviders } from '../../test/utils/testUtils';

describe('ContactUs Component', () => {
  it('renders contact us page', () => {
    renderWithProviders(<ContactUs />);
    expect(screen.getByText(/contact|get in touch/i)).toBeInTheDocument();
  });

  it('renders contact form', () => {
    renderWithProviders(<ContactUs />);
    const nameInput = screen.getByLabelText(/name/i);
    expect(nameInput).toBeInTheDocument();
  });

  it('allows entering contact information', () => {
    renderWithProviders(<ContactUs />);
    const nameInput = screen.getByLabelText(/name/i);
    fireEvent.change(nameInput, { target: { value: 'Test User' } });
    expect(nameInput.value).toBe('Test User');
  });
});

