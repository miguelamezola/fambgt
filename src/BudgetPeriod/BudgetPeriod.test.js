import { render, screen } from '@testing-library/react';
import BudgetPeriod from './BudgetPeriod';

test('renders pay period start date label', () => {
    render(<BudgetPeriod />);
    const linkElement = screen.getByText(/Start Date/i);
    expect(linkElement).toBeInTheDocument();
});

test('renders pay period start date', () => {
    let date = new Date('2021-08-14')
    render(<BudgetPeriod start={date}/>);
    const linkElement = screen.getByText(/2021-08-14/i);
    expect(linkElement).toBeInTheDocument();
});

test('renders pay period end date label', () => {
    render(<BudgetPeriod />);
    const linkElement = screen.getByText(/End Date/i);
    expect(linkElement).toBeInTheDocument();
});

test('renders pay period end date', () => {
    let date = new Date('2021-08-29')
    render(<BudgetPeriod end={date}/>);
    const linkElement = screen.getByText(/2021-08-29/i);
    expect(linkElement).toBeInTheDocument();
});