const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const schema = require("./schema/schema");
const mongoose = require("mongoose");

mongoose.connect(
  "mongodb+srv://sujith:Qq3DAcyjJ3myLubt@cluster0.lwljbot.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
);

mongoose.connection.once("open", () => {
  console.log('mongoose is connected')
});

const app = express();
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    graphiql: true,
  })
);

app.listen(4000, () => {
  console.log("app is listing to 4000");
});