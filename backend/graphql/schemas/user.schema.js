const { gql } = require('apollo-server-express');

module.exports = gql`
  type Role {
    permissions: [String]!
    type: String!
    is_archive: Boolean!
  }  

  type User {
    id: String!
    email: String!
    name: String!
    is_archive: Boolean!
    role: Role!
  }

  extend type Query {
    profile: User
  }
  
  extend type Mutation {
    signup(email: String!, password: String!, name: String!): LoginResponse
  }
`;