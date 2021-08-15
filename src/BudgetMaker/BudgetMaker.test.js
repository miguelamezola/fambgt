import { render, screen } from '@testing-library/react';
import BudgetMaker from './BudgetMaker';

test('renders budget maker title', () => {
    render(<BudgetMaker />);
    const linkElement = screen.getByText(/Budget Maker/i);
    expect(linkElement).toBeInTheDocument();
});