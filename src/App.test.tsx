import React from 'react';
import {render, screen} from '@testing-library/react';
import Fluent from './Fluent';

test('renders learn react link', () => {
  render(<Fluent/>);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
