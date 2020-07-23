const { gql } = require('apollo-server-express');

const authSchema = require('./schemas/auth.schema');
const userSchema = require('./schemas/user.schema');
const fileSchema = require('./schemas/file.schema');
const folderSchema = require('./schemas/folder.schema');

const rootSchema = gql`
  scalar Date

  type Query {
    _: Boolean
  }

  type Mutation {
    _: Boolean
  }

  type Subscription {
    _: Boolean
  }
`;

module.exports = [rootSchema, userSchema, authSchema, fileSchema, folderSchema];
