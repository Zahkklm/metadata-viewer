/** @jest-environment jsdom */
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import App from './App';
import React, { useState } from 'react';

// Create a mock adapter for axios
const mock = new MockAdapter(axios);

describe('App Component', () => {
  beforeEach(() => {
    mock.reset();
  });

  test('renders Metadata Viewer title', () => {
    render(<App />);
    const titleElement = screen.getByText(/Metadata Viewer/i);
    expect(titleElement).toBeInTheDocument();
  });

  test('handles input change correctly', () => {
    render(<App />);
    const input = screen.getByPlaceholderText(/Enter URL 1/i);
    fireEvent.change(input, { target: { value: 'https://example.com' } });
    expect(input.value).toBe('https://example.com');
  });

  test('submits form and handles successful fetch', async () => {
    mock.onPost('https://localhost:5000/fetch-metadata').reply(200, [
      {
        url: 'https://example.com',
        title: 'Example Domain',
        description: 'Example Description',
        image: 'https://example.com/image.jpg',
      },
      {
        url: 'https://example.com',
        title: 'Example Domain',
        description: 'Example Description',
        image: 'https://example.com/image.jpg',
      },
      {
        url: 'https://example.com',
        title: 'Example Domain',
        description: 'Example Description',
        image: 'https://example.com/image.jpg',
      }
    ]);

    render(<App />);
    fireEvent.change(screen.getAllByPlaceholderText(/Enter URL 1/i)[0], { target: { value: 'https://example.com' } });
    fireEvent.change(screen.getAllByPlaceholderText(/Enter URL 2/i)[0], { target: { value: 'https://example.com' } });
    fireEvent.change(screen.getAllByPlaceholderText(/Enter URL 3/i)[0], { target: { value: 'https://example.com' } });
    fireEvent.click(screen.getByText(/Fetch Metadata/i));

    const titleElement = await screen.findByTestId('card-output-success');
    expect(titleElement).toBeInTheDocument();
    
  });

  test('shows loading state during fetch', async () => {
    mock.onPost('https://localhost:5000/fetch-metadata').reply(() => {
      return new Promise((resolve) => {
        setTimeout(() => resolve([200, []]), 1000); // Simulate delay
      });
    });

    render(<App />);
    fireEvent.change(screen.getAllByPlaceholderText(/Enter URL 1/i)[0], { target: { value: 'https://example.com' } });
    fireEvent.change(screen.getAllByPlaceholderText(/Enter URL 2/i)[0], { target: { value: 'https://example.com' } });
    fireEvent.change(screen.getAllByPlaceholderText(/Enter URL 3/i)[0], { target: { value: 'https://example.com' } });
    fireEvent.click(screen.getByText(/Fetch Metadata/i));

    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });

  test('renders the initial UI with empty input fields', () => {
    render(<App />);
    const inputElements = screen.getAllByPlaceholderText(/Enter URL/i);
    expect(inputElements).toHaveLength(3);
    inputElements.forEach(input => expect(input.value).toBe(''));
  });

  test('updates input values correctly', () => {
    render(<App />);
    const inputElements = screen.getAllByPlaceholderText(/Enter URL/i);

    fireEvent.change(inputElements[0], { target: { value: 'https://example.com' } });
    fireEvent.change(inputElements[1], { target: { value: 'https://another-example.com' } });

    expect(inputElements[0].value).toBe('https://example.com');
    expect(inputElements[1].value).toBe('https://another-example.com');
  });

  
});
