const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config({ path: "./variables.env" });
const Recipe = require("./models/Recipe");
const User = require("./models/User");

// Bring in GraphQL Express middleware
const { graphiqlExpress, graphqlExpress } = require("apollo-server-express");
const { makeExecutableSchema } = require("graphql-tools");

const { typeDefs } = require("./schema");
const { resolvers } = require("./resolvers");

// Create Schema
const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("DB connected"))
  .catch(err => console.error(err));

const app = express();

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true
};

app.use(cors(corsOptions));

// Create GraphiQL application
app.use("/graphiql", graphiqlExpress({ endpointURL: "/graphql" }));

// Connect schemas with GraphQL
app.use(
  "/graphql",
  bodyParser.json(),
  graphqlExpress({
    schema,
    context: {
      Recipe,
      User
    }
  })
);

const PORT = process.env.PORT || 4444;

app.listen(PORT, () => {
  console.log(`Server listening on PORT ${PORT}`);
});
