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

test('can input username', () => {
  const result = render(<Register />);
  const userNameInputElement = result.container.querySelector('input[name="username"]');
  expect(userNameInputElement).toBeInTheDocument();
});

test('can input password', () => {
  const result = render(<Register />);
  const pswdInputElement = result.container.querySelector('input[name="password"]');
  expect(pswdInputElement).toBeInTheDocument();
});

test('has create account button', () => {
  const result = render(<Register />);
  const signInButton = result.container.querySelector('input[type="button"]');
  expect(signInButton).toBeInTheDocument();
  expect(signInButton.value).toBe("Create Account");
});

test('renders login div', () => {
  const { container } = render(<Register />);
  expect(container.getElementsByClassName('login-div').length).toBe(1);
});