import { render, screen } from '@testing-library/react';
import App from './App';

test('renders "fambgt" app title', () => {
  render(<App />);
  const linkElement = screen.getByText(/fambgt/i);
  expect(linkElement).toBeInTheDocument();
});
