import React from "react";
import App from "./App";
import '@testing-library/jest-dom';
import {render, screen} from '@testing-library/react';

test('loads and shows file upload', async () => {
    // ARRANGE
    render(<App />);

    // ASSERT
    expect(screen.queryByText('File Upload')).toBeInTheDocument();
})