import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CalendarComponent from './CalendarComponent';

describe('CalendarComponent', () => {
  test('renders calendar and displays selected date', () => {
    render(<CalendarComponent />);

    // Check if the calendar is rendered
    const calendar = screen.getByRole('heading', { name: /select a date/i });
    expect(calendar).toBeInTheDocument();

    // Check the default selected date
    const selectedDate = screen.getByText(/selected date:/i);
    expect(selectedDate).toHaveTextContent(new Date().toLocaleDateString());

    // Simulate date selection
    const dateButton = screen.getByRole('gridcell', { name: /1/i }); // Change the number to match your desired date
    fireEvent.click(dateButton);

    // Check if the selected date updates
    expect(selectedDate).toHaveTextContent(new Date(new Date().setDate(1)).toLocaleDateString()); // Adjust as necessary
  });
});