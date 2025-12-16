import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from '../../contexts/ThemeContext';

/**
 * Custom render function that includes all necessary providers
 * @param {React.ReactElement} ui - The component to render
 * @param {Object} options - Render options
 * @param {string} options.theme - Theme to use ('light' or 'dark')
 * @param {Object} options.providers - Additional providers to wrap
 * @returns {Object} Render result with utilities
 */
export const renderWithProviders = (ui, options = {}) => {
  const { theme = 'light', providers = [], ...renderOptions } = options;

  const AllTheProviders = ({ children }) => {
    let content = children;

    // Wrap with ThemeProvider
    content = (
      <ThemeProvider value={{ theme, toggleTheme: () => {} }}>
        {content}
      </ThemeProvider>
    );

    // Wrap with any additional providers
    providers.forEach((Provider) => {
      content = <Provider>{content}</Provider>;
    });

    return content;
  };

  return render(ui, { wrapper: AllTheProviders, ...renderOptions });
};

/**
 * Render component with dark theme
 */
export const renderWithDarkTheme = (ui, options = {}) => {
  return renderWithProviders(ui, { ...options, theme: 'dark' });
};

/**
 * Render component with light theme
 */
export const renderWithLightTheme = (ui, options = {}) => {
  return renderWithProviders(ui, { ...options, theme: 'light' });
};

/**
 * Wait for async operations to complete
 */
export const waitForAsync = () => new Promise((resolve) => setTimeout(resolve, 0));

/**
 * Mock window.location
 */
export const mockWindowLocation = (url) => {
  delete window.location;
  window.location = new URL(url);
};

/**
 * Reset window.location mock
 */
export const resetWindowLocation = () => {
  delete window.location;
  window.location = global.location;
};

/**
 * Create a mock function that returns a promise
 */
export const createMockPromise = (data, delay = 0) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delay);
  });
};

/**
 * Create a mock function that rejects with an error
 */
export const createMockReject = (error, delay = 0) => {
  return new Promise((_, reject) => {
    setTimeout(() => reject(error), delay);
  });
};

// Re-export everything from @testing-library/react
export * from '@testing-library/react';

