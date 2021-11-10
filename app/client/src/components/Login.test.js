import React from 'react';
import { render } from '@testing-library/react';
// import renderer from 'react-test-renderer';
import Login from './Login';

// const renderer = require('react-test-renderer');

test('renders title content', () => {
  const { getByText } = render(<Login />);
  const titleElement = getByText(/chatchat!/);
  expect(titleElement).toBeInTheDocument();
});

test('renders login redirect', () => {
  const { container } = render(<Login />);
  expect(container.getElementsByClassName('login-redirect').length).toBe(1);
});

test('renders login div', () => {
  const { container } = render(<Login />);
  expect(container.getElementsByClassName('login-div').length).toBe(1);
});