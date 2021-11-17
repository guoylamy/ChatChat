import React from 'react';
import {render, screen} from '@testing-library/react'
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

test('can input username', () => {
  const result = render(<Login />);
  const userNameInputElement = result.container.querySelector('input[name="username"]');
  expect(userNameInputElement).toBeInTheDocument();
});

test('can input password', () => {
  const result = render(<Login />);
  const pswdInputElement = result.container.querySelector('input[name="password"]');
  expect(pswdInputElement).toBeInTheDocument();
});

test('has sign in button', () => {
  const result = render(<Login />);
  const signInButton = result.container.querySelector('input[type="button"]');
  expect(signInButton).toBeInTheDocument();
  expect(signInButton.value).toBe("Sign in");
});

test('renders login div', () => {
  const { container } = render(<Login />);
  expect(container.getElementsByClassName('login-div').length).toBe(1);
});