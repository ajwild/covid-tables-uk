const gatsbyConfig = {
  plugins: [
    {
      resolve: 'gatsby-plugin-graphql-codegen',
      options: {
        fileName: './generated/gatsby-graphql.d.ts',
        documentPaths: ['./src/**/*.{ts,tsx}'],
      },
    },
    {
      resolve: 'gatsby-plugin-extract-schema',
      options: {
        dest: './generated/gatsby-graphql.json',
      },
    },
  ],
};

export default gatsbyConfig;
