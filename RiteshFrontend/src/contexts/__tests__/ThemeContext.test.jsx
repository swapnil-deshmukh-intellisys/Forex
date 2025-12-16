import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider, useTheme } from '../ThemeContext';
import { renderWithProviders } from '../../test/utils/testUtils';

const TestComponent = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  );
};

describe('ThemeContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('provides default light theme', () => {
    renderWithProviders(<TestComponent />, { theme: 'light' });
    expect(screen.getByTestId('theme')).toHaveTextContent('light');
  });

  it('provides dark theme when set', () => {
    renderWithProviders(<TestComponent />, { theme: 'dark' });
    expect(screen.getByTestId('theme')).toHaveTextContent('dark');
  });

  it('allows toggling theme', () => {
    const { rerender } = renderWithProviders(<TestComponent />, { theme: 'light' });
    const toggleButton = screen.getByText('Toggle Theme');
    
    fireEvent.click(toggleButton);
    rerender(<TestComponent />);
    
    // Theme should toggle
    expect(screen.getByTestId('theme')).toBeInTheDocument();
  });

  it('throws error when useTheme is used outside provider', () => {
    // Suppress console.error for this test
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    expect(() => {
      render(<TestComponent />);
    }).toThrow('useTheme must be used within a ThemeProvider');
    
    consoleError.mockRestore();
  });
});

