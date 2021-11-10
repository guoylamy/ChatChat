import React from 'react';
import { render, screen } from '@testing-library/react';
// import renderer from 'react-test-renderer';
import Register from './Register';

// const renderer = require('react-test-renderer');

test('renders title content', () => {
  const { getByText } = render(<Register />);
  const titleElement = getByText(/chatchat!/);
  expect(titleElement).toBeInTheDocument();
});

test('renders login redirect', () => {
  render(<Register />);
  const buttonElement = screen.getByRole('button');
  expect(buttonElement).toBeInTheDocument();
});

test('renders login div', () => {
  const { container } = render(<Register />);
  expect(container.getElementsByClassName('login-div').length).toBe(1);
});