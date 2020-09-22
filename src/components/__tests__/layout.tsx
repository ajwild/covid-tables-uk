import React from 'react';
import { render } from '@testing-library/react';

import Layout from '../layout';

describe('Layout', () => {
  it('Includes one main landmark', () => {
    const { getByRole } = render(<Layout>Content</Layout>);
    const main = getByRole('main');

    expect(main).toBeInTheDocument();
  });
});
