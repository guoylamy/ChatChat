import React from 'react';
import { render, screen } from '@testing-library/react';
import Router from "react-router-dom";
// import renderer from 'react-test-renderer';
import GroupsPage from './GroupsPage';

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: jest.fn(),
}));

// jest.mock(getProfileInfoLab);

const createWrapper = () => {
  return render(<GroupsPage />);
};

test('renders title content', () => {
  jest.spyOn(Router, 'useParams').mockReturnValue({ userName: 'user1' });
  const container = createWrapper();
  const titleElement = container.getByText("nav bar");
  expect(titleElement).toBeInTheDocument();
});
