import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import MarketNewsFeed from '../MarketNewsFeed';

describe('Simple MarketNewsFeed Test', () => {
  it('should render without crashing', () => {
    render(<MarketNewsFeed />);
    expect(screen.getByText('Market News')).toBeInTheDocument();
  });
});
