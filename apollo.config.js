// eslint-disable-next-line functional/immutable-data
module.exports = {
  client: {
    name: 'your-project-name',
    tagName: 'graphql',
    includes: ['./src/**/*.{ts,tsx}'],
    service: {
      localSchemaFile: './generated/gatsby-graphql.json',
      name: 'GatsbyJS',
      url: 'http://localhost:8000/___graphql',
    },
  },
};
