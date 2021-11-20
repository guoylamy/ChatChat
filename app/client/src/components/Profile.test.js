import React from 'react';
import { render, screen } from '@testing-library/react';
import Router from "react-router-dom";
// import renderer from 'react-test-renderer';
import Profile from './Profile';

const getProfileInfoLab = require('../getProfileInfo');

// const renderer = require('react-test-renderer');
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: jest.fn(),
}));

jest.mock('../getProfileInfo');

getProfileInfoLab.getUserGroups.mockResolvedValue(["Group0", "Group1"]);

const createWrapper = () => {
  return render(<Profile />);
};

test('renders title content', () => {
  jest.spyOn(Router, 'useParams').mockReturnValue({ userName: 'user1' });
  const container = createWrapper();
  const titleElement = container.getByText("chatchat!");
  expect(titleElement).toBeInTheDocument();
});

test('renders page title', () => {
  jest.spyOn(Router, 'useParams').mockReturnValue({ userName: 'user1' });
  const container = createWrapper();
  const pageTitleElement = container.getByTestId('page-title');
  expect(pageTitleElement).toBeInTheDocument();
  expect(pageTitleElement.innerHTML).toBe("My Profile");
});

test('has title: my groups', () => {
  jest.spyOn(Router, 'useParams').mockReturnValue({ userName: 'user1' });
  createWrapper();
  const groupTitle = screen.getByText(/My Groups/i)
  expect(groupTitle).toBeInTheDocument();
});

test('renders group list', () => {
  jest.spyOn(Router, 'useParams').mockReturnValue({ userName: 'user1' });
  const container = createWrapper();
  const groupListElement = container.getByTestId('group-list');
  expect(groupListElement).toBeInTheDocument();
});

test('has title: My Friends', () => {
  jest.spyOn(Router, 'useParams').mockReturnValue({ userName: 'user1' });
  createWrapper();
  const friendsListTitle = screen.getByText(/My Friends/i)
  expect(friendsListTitle).toBeInTheDocument();
});

test('renders friends list', () => {
  jest.spyOn(Router, 'useParams').mockReturnValue({ userName: 'user1' });
  const container = createWrapper();
  const friendsListElement = container.getByTestId('friend-list');
  expect(friendsListElement).toBeInTheDocument();
});

test('has title: About Me', () => {
  jest.spyOn(Router, 'useParams').mockReturnValue({ userName: 'user1' });
  createWrapper();
  const profileTitle = screen.getByText(/About Me/i)
  expect(profileTitle).toBeInTheDocument();
});

test('renders user name', async () => {
  jest.spyOn(Router, 'useParams').mockReturnValue({ userName: 'user1' });
//   jest.spyOn(getProfileInfoLab, "getUserGroups").mockReturnValue(["Group0", "Group1"]);
  const container = await createWrapper();
  const userNameElement = container.getByTestId('user-name');
  expect(userNameElement).toBeInTheDocument();
  expect(userNameElement.innerHTML).toBe("user1");
});