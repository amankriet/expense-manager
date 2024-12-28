import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ErrorBoundary from '../utils/ErrorBoundary';

// A component that throws an error
const ProblemChild = () => {
    throw new Error('Test error');
};

test('ErrorBoundary catches errors and displays fallback UI', () => {
    render(
        <ErrorBoundary>
            <ProblemChild />
        </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong.')).toBeInTheDocument();
});