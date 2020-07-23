const { gql } = require('apollo-server-express');

module.exports = gql`
  type Folder {
    id: String!
    name: String!
    path: String!
    tags: [String]!
    folder: Folder,
    created_at: Date
  }

  type FolderInstance {
    id: String!
    name: String!
    path: String!
    tags: [String]!
    created_at: Date
  }
  
  extend type Mutation {
    createNewFolder(name: String!, folderId: String, tags: [String]): FolderInstance!
    renameFolder(folderId: String!, folderName: String): Folder!
    removeFolder(folderIds: [String!]!): Boolean
  }
`;
