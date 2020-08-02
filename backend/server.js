require('dotenv').config();
const config = require("config");
const Joi = require("@hapi/joi");
Joi.objectId = require("joi-objectid")(Joi);
const express = require("express");
const { join } = require("path");
const helmet = require("helmet");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const zip = require('express-easy-zip');
const { ApolloServer } = require('apollo-server-express');
const rootSchema = require('./graphql/root.schema');
const resolvers = require('./graphql/root.resolvers');
const { getUserLogined } = require('./services/authentication.service');
const createUploadsDirs = require("./utils/createUploadsDirs");
const { downloadFileAndFolder } = require('./services/file.service');
const { adminAuthenticationMiddleware } = require('./middlewares/auth.middleware');
const { graphqlUploadExpress } = require('graphql-upload');
const logger = require('./utils/logger');
const app = express();
const mongo_dev = config.get("db_dev");
console.log(mongo_dev)
const port = process.env.PORT || config.get("port");
const corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
};

mongoose.connect(mongo_dev, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});

const db = mongoose.connection;
db.on("error", () => logger.error(console, "connection error:"));
db.once("open", async function () {
  console.log("Connected to MonogoDB ->", mongo_dev);
  await createUploadsDirs([
    join(__dirname, "public", "uploads"),
    join(__dirname, "public", "shared"),
    join(__dirname, "public", "thumbnails"),
    join(__dirname, "temp")
  ]);
});

app.use(helmet());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(zip());

global.__uploadDir = join(__dirname, "public", "uploads");
global.__thumbDir = join(__dirname, "public", "thumbnails");
// configuring the upload file routes
app.use(express.static("public"));
app.get('/', (req, res) => {
  return res.json({ raw: true })
});
app.post('/download', adminAuthenticationMiddleware, downloadFileAndFolder);

const serverGraph = new ApolloServer({
  typeDefs: rootSchema,
  resolvers,
  playground: {
    endpoint: '/graphql',
    settings: {
      'editor.theme': 'dark'
    }
  },
  context: async ({req}) => {
    const userData = await getUserLogined(req);
    return { user: userData };
  }
});
serverGraph.applyMiddleware({ app });

app.listen(port, () => console.log(`Listening on port ${port}`));
