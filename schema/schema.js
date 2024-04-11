const graphql = require("graphql");
const _ = require("lodash");
const Book = require("../models/book");
const Author = require("../models/author");

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLList,
  GraphQLInt,
  GraphQLNonNull,
} = graphql;

//for book
const BookType = new GraphQLObjectType({
  name: "Book",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    genre: { type: GraphQLString },
    Authors: {
      type: AuthorType,
      resolve(parent, args) {
        //console.log(parent);
        //return _.find(authors, { id: parent.authorId });
        return Author.findById(parent.authorId);
      },
    },
  }),
});

//for author
const AuthorType = new GraphQLObjectType({
  name: "Author",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    Books: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        //return _.filter(books, { authorId: parent.id });
        return Book.find({ authorId: parent.id });
      },
    },
  }),
});
// Root type
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    Book: {
      type: BookType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        //return _.find(books, { id: args.id });
        return Book.findById(args.id);
      },
    },
    Author: {
      type: AuthorType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        //return _.find(authors, { id: args.id });
        return Author.findById(args.id);
      },
    },
    Books: {
      type: new GraphQLList(BookType),
      args: {
        page: { type: GraphQLInt },
        pageSize: { type: GraphQLInt }
      },
      resolve(parent, args) {
        //return books;
        const { page, pageSize } = args;
        return Book.find({})
          .skip((page - 1) * pageSize)
          .limit(pageSize);
      },
    },
    Authors: {
      type: new GraphQLList(AuthorType),
      args: {
        page: { type: GraphQLInt },
        pageSize: { type: GraphQLInt }
      },
      resolve(parent, args) {
        //return authors;
        const { page, pageSize } = args;
        return Author.find({})
          .skip((page - 1) * pageSize)
          .limit(pageSize);
      },
    },
  },
});
//mutation
const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    
    //mutation for adding book
    addAuthor: {
      type: AuthorType,
      args: {
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
      },
      resolve(parent, args) {
        let author = new Author({
          name: args.name,
          age: args.age,
        });
        return author.save();
      },
    },
    
    //mutation for adding author
    addBook: {
      type: BookType,
      args: {
        name: { type: GraphQLString },
        genre: { type: GraphQLString },
        authorId: { type: GraphQLID },
      },
      resolve(parent, args) {
        let book = new Book({
          name: args.name,
          genre: args.genre,
          authorId: args.authorId,
        });
        return book.save();
      },
    },
    
    //mutation for updating author
    updateAuthor: {
      type: AuthorType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
      },
      resolve(parent, args) {
        return Author.findByIdAndUpdate(
          args.id,
          { $set: { name: args.name, age: args.age } },
          { new: true }
        );
      },
    },
    
    //mutation for updating book
    updateBook: {
      type: BookType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        name: { type: GraphQLString },
        genre: { type: GraphQLString },
        authorId: { type: GraphQLID },
      },
      resolve(parent, args) {
        return Book.findByIdAndUpdate(
          args.id,
          { $set: { name: args.name, genre: args.genre, authorId: args.authorId } },
          { new: true }
        );
      },
    },
    
    //mutation for deleting author
    deleteAuthor: {
      type: AuthorType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        return Author.findByIdAndDelete(args.id);
      },
    },
    
    //mutation for deleting book
    deleteBook: {
      type: BookType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        return Book.findByIdAndDelete(args.id);
      },
    },
  },
});
module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});