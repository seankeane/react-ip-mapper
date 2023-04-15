import React, { useState as useStateMock } from 'react'
import { App, checkIsValidIPv4 } from "./App";
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

jest.mock('react', () => ({
    ...jest.requireActual('react'),
    useState: jest.fn(),
}))

describe('Header', () => {
    const setState = jest.fn();

    beforeEach(() => {
        useStateMock.mockImplementation(init => [init, setState])
    });

    test('loads and shows file upload', async () => {
        // ARRANGE
        render(<App />);

        // ASSERT
        expect(screen.getByText('File Upload')).toBeInTheDocument();
    });


});

test('is IPv4 checker working', async () => {
    // ASSERT
    expect(checkIsValidIPv4('8.8.8.8')).toBeTruthy();
    expect(checkIsValidIPv4('')).toBeFalsy();
    expect(checkIsValidIPv4('8.8.8')).toBeFalsy();
});