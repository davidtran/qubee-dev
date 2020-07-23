const { gql } = require('apollo-server-express');

module.exports = gql`
  type LoginResponse {
    token: String!
  }
  extend type Mutation {
    login(email: String!, password: String!): LoginResponse
  }
`;
