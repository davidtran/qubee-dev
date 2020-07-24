const { gql } = require('apollo-server-express');

module.exports = gql`
  type AuthorFile {
    id: String!
    email: String!
    name: String!
  }
  
  type File {
    id: String!
    file_name: String!
    type: String!
    created_at: Date
    user: AuthorFile
    size: Int!
    tags: [String]!
    is_video: Boolean!
    is_image: Boolean!
    thumbnail: String
  }

  type FilesAndFolders {
    folders: [Folder]
    files: [File]
    path: String!
  }

  type FileAndFolderDownload {
    code: String!
    name: String!
  }

  extend type Mutation {
    uploadFile(file: Upload!, folderId: String, tags: [String]): File!
    downloadFile(folderId: String, folders: [String!]!, files: [String!]!): FileAndFolderDownload
    renameFile(fileId: String!, fileName: String!): File
    removeFile(files: [String!]!): Boolean
    changeFileTags(fileId: String!, tags: [String!]!): File!
    moveFile(folderId: String, files: [String!]!): Boolean
  }
  
  extend type Query {
    getFiles(folderId: String, keyword: String): FilesAndFolders!
  }
`;
