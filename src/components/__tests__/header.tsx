import React from 'react';
import { render } from '@testing-library/react';

import Header from '../header';

describe('Header', () => {
  it('renders site title', () => {
    const { getByRole } = render(<Header />);
    const title = getByRole('heading');

    expect(title).toBeInTheDocument();
  });
});
