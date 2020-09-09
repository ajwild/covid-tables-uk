import React from 'react';
import { render } from '@testing-library/react';

import Header from '../header';

describe('Header', () => {
  it('renders site title', () => {
    const { getByText } = render(<Header />);
    const title = getByText(/covid-19 tables uk/i);

    expect(title).toBeInTheDocument();
  });
});
