const authenticationResolver = require('./resolvers/authentication.resolver');
const userResolver = require('./resolvers/user.resolver');
const fileResolver = require('./resolvers/file.resolver');
const folderResolver = require('./resolvers/folder.resolver');

module.exports = [
  authenticationResolver,
  userResolver,
  fileResolver,
  folderResolver
];
