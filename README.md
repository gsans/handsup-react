# todo-react

Example forked from [angular-apollo-todo-example](https://github.com/graphcool-examples/angular-apollo-todo-example)

You can read the blog post [GraphQL and the amazing Apollo Client](https://medium.com/@gerard.sans/graphql-and-the-amazing-apollo-client-fe57e162a70c) covering parts of it. 

Updated react-apollo to use 0.13.0.

## Getting Started

I have used an early access to a [graph.cool](http://graph.cool) account. Code only for reference purposes.

The GraphQL data model used is:

```graphql
type Todo {  
  id: ID!
  text: String!
  complete: Boolean!
}

type Query {
  allTodoes(skip: Int, take: Int): [Todo!]!
}

type Mutation {
  createTodo(text: String!, complete: Boolean!): Todo
  updateTodo(id: ID!, text: String, complete: Boolean): Todo
}

schema { 
  query: Query,  
  mutation: Mutation 
}
```
