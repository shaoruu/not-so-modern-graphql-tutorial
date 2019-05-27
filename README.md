# Modern GraphQL Tutorial

After this tutorial, you will be able to:

- Create your own GraphQL schema
- Serve backend endpoints for data fetching
- Connect client to backend server
- Fetch data from client side

## Table of Contents

1. [Introduction](#Introduction)
2. [Getting Started](#Getting-Started)
3. [Basic Syntax](#Basic-Syntax)
4. [GraphQL Playground](#GraphQL-Playground)
5. [Queries, Mutations and Subscriptions](#Queries-Mutations-and-Subscriptions)
   - [Queries](#Queries)
   - [Mutations](#Mutations)
   - [Subscriptions](#Subscriptions)
6. [Apollo Client](#Apollo-Client)
7. [Wrapping Up](#Wrapping-Up)
8. [References](#References)

## Introduction

Before we start, let me give you an brief introduction to GraphQL. GraphQL is a _query language_ for API's. It is a more efficient alternative to traditional RESTful API's since it is:

- **Faster** - with user-defined specification for data fetching,, GraphQL prevents clients from underfetching or overfetching, making network requests more efficient.
- **More Flexible** - user can define their own schemas and data types to share between frontend and backend.
- **Faster Production** - with schemas acting as a contract for data fetching between the frontend team and backend team, both teams can do their individual work without further communication.

An example would be: Say you are creating an Instagram-like app. When a user opens up the app, you want to show him the posts on his news feed, so you make a network request to your backend and fetch all the post data. As for the traditional RESTful API, you fetch the post data including the comments and details about the comments on the posts. However, that would be overfetching since the user may not necessarily click into individual posts to check comments. Here, GraphQL comes into play by letting you specify what kind of data you want and how many comments you want for each post. This not only limits the amount of data needed to transfer through the internet, it also speeds up the fetching efficiency and speed.

In this tutorial, I will teach you how to set up your own GraphQL API, write a simple GraphQL client, and start communication between backend and frontend.

I will be using [graphql-yoga](https://github.com/prisma/graphql-yoga) for the backend service, and [apollo](https://github.com/prisma/graphql-yoga) for a simple client side.

## Getting Started

Type the following steps into terminal to get started with this tutorial.

```bash
git clone https://github.com/ian13456/modern-graphql-tutorial.git

cd modern-graphql-tutorial

npm install
```

I will walk you through each file later on and teach you what it's for.

## GraphQL Playground

One awesome tool that comes with [graphql-yoga](https://github.com/prisma/graphql-yoga) is [GraphQL Playground](https://github.com/prisma/graphql-playground). GraphQL Playground allows us to test our schemas without having to set up a client side. Essentially, it serves as a GraphQL client to run [queries](#Queries) and [mutations](#Mutations) on.

After cloning the repository, run `npm start` and navigate to http://localhost:4000 Don't worry. At this point it is normal to have zero clue about what the playground is all about. Pasted below is the process of setting up a simple GraphQLServer and serving it on port 4000. Disregard the imports as they will be discussed later on. All you have to know is that the following section of code sets you up with a working GraphQLServer.

```javascript
// src/index.js

import { GraphQLServer, PubSub } from 'graphql-yoga'
import db from './db'
import Query from './resolvers/Query'
import Mutation from './resolvers/Mutation'
import Subscription from './resolvers/Subscription'
import User from './resolvers/User'
import Post from './resolvers/Post'
import Comment from './resolvers/Comment'

// This will be covered later.
const pubsub = new PubSub()

// Don't worry about anything; just know that this initializes the server.
const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers: {
    Query,
    Mutation,
    Subscription,
    User,
    Post,
    Comment
  },
  context: {
    db,
    pubsub
  }
})

// Serving server on port 4000
server.start({ port: process.env.PORT | 4000 }, () => {
  console.log(`The server is up on port ${process.env.PORT | 4000}!`)
})
```

## Basic Syntax

As mentioned before, GraphQL is a query language with _specific_ syntax.

Here an example of a basic query:

```graphql
query {
  users {
    username
    password
    creditCardNumber
  }
}
```

As I said before, GraphQL gives you the ability to specify what data's are needed for fetching.

Lets start from the beginning. The out-most layer `query { }` specifies that the type of this GraphQL request is a query, meaning that it is simply asking for data.

On the second layer, we have the specific _query_ to run called `users { }`. This tells the server which kind of data the client wants, and lets the server know what to do accordingly.

Lastly, within the `users` query we have the specific attributes that we are fetching for **EACH** user, in this case we are trying to fetch the `username`, `password` and `credit card number`.

## Schema

A GraphQL Schema is what defines the basic types. The file is often named `schema.graphql`, sitting in the same directory as index.js. You add it into the server with the **`typedefs`** option in graphql-yoga.

### Basic Types:

These are the basic scalar types in GraphQL. Scalar types basically mean that these values are scalars and **do not contain any sub-fields below them.**

- String
- Int
- Float
- Boolean
- ID

To add on, GraphQL "[Lists](https://graphqlmastery.com/blog/graphql-list-how-to-use-arrays-in-graphql-schema)" is a type that defines an array of a certain type with the notation `[]`. For example: `[String]` represents a type that is a list of Strings.

For other special types such as `queries`, `mutations` and `subscriptions`, I will go deeper on how to define them once I explain what they are later on.

## Queries, Mutations and Subscriptions

Queries, mutations and subscriptions are the three **major** types that you include in `schema.graphql` that define what the GraphQL requests should look like. Essentially they differ between different HTTP request types for each GraphQL request.

Before I dig into what these three types are, I want to teach you about what GraphQL **resolvers** are for first.

[Resolvers](https://medium.com/paypal-engineering/graphql-resolvers-best-practices-cd36fdbcef55) are methods that you write in any language that defines what each query, mutation, and subscription does. They basically tell the GraphQL endpoint how to handle different types of data fetches. In most cases, resolvers are where you alter the _database_ after receiving data from GraphQL requests. In graphql-yoga, they are the files imported and included in the **`resolvers`** option in the new `GraphQLServer`.

With the knowledge of `schemas` and `resolvers`, we can now learn the top three request types in GraphQL.

### Queries

These are the types of network requests that simply ask for data from the server.

Remember the example I showed you in the [Basic Syntax](#Basic-Syntax) section?

Here I defined the exact same query type `users` that I showed you.

```graphql
# src/schema.graphql
type Query {
  users(query: String): [User!]!
}

type User {
  id: ID!
  name: String!
  email: String!
  age: Int
  posts: [Post!]!
  comments: [Comment!]!
}
```

There are three important keys that I want to point out in this short GraphQL code:

1. `type Query` v.s. `type User`
   - Remember "Query" is the type of the _outer-most layer_ in a GraphQL request, and "User" in this case is just a _user-defined_ type that can be used in the entire schema.
2. `!` Exclamation marks after type names
   - `!` in GraphQL means **non-nullable**, meaning that the data sent back cannot be null or undefined. For example, `[String!]!` represents a non-nullable list containing values of Strings that cannot be null.
3. `(query: String)` after `users`
   - Just like functions, GraphQL requests can have additional arguments. In this case the query `users` takes in `query` of type `String`. <small>Notice how there isn't a `!` after `String`. This means that the argument `query` is **optional**.</small>

However, this only tells GraphQLServer what the query _looks like_ though. So, below is where I use **resolvers** to define **HOW** the server should handle any `users` requests.

```javascript
// src/resolvers/Query.js
users(parent, args, context, info) {
    const { db } = context

    // Check if the optional `query` of type String is passed in.
    if (!args.query) {
        return db.users
    }

    // Reaching here means `query` is defined -> filter the data passed back.
    return db.users.filter((user) => {
        return user.name.toLowerCase().includes(args.query.toLowerCase())
    })
}
```

Here's a possible GraphQL request for this `users` query:

```graphql
query {
  users(query: "a") {
    id
    name
    age
  }
}

# results:
{
  "data": {
    "users": [
      {
        "id": "1",
        "name": "Andrew",
        "age": 27
      },
      {
        "id": "2",
        "name": "Sarah",
        "age": null
      }
    ]
  }
}
```

### Mutations

Now that you have a basic understanding of what queries are, Mutations are fairly easy to understand. Mutations are where you _mutate_ the data in the database. <small>note that I used a temporary file `db.js` as a database since the primary focus of this tutorial is on GraphQL not on databases.</small>

```graphql
# src/schema.graphql
type Mutation {
  createUser(data: CreateUserInput!): User!
}

input CreateUserInput {
  name: String!
  email: String!
  age: Int
}
```

There are only a few things worth noticing in this Mutation type specification:

1. `type Mutation` v.s. previous `type Query`
   - Later on when making GraphQL requests, use `mutation { }` instead of `query { }`
2. new keyword `input`
   - This is used for argument specifications. When arguments become long and nasty, it's best to extract them and define an input type.

Ok, with the `createUser` mutation specified above, all we're missing is the _resolver_ corresponding for it &darr;

```javascript
// src/resolvers/Mutation.js
createUser(parent, args, context, info) {
    const { db } = context

    // Check if email is already taken in fake database
    const emailTaken = db.users.some((user) => user.email === args.data.email)

    if (emailTaken) {
        throw new Error('Email taken')
    }

    // Create new user object
    const user = {
        id: uuidv4(),
        ...args.data
    }

    // Save (append) it to face database
    db.users.push(user)

    return user
}
```

Worth noting that in a regular project, the lines of code where I alter the fake database should be replaced by processes that communicate with an actual database and change/save/delete data.

Here's an example of a GraphQL mutation:

```graphql
mutation {
  createUser(data: {
    name: "Morgan"
    age: 81
    email: "morganfreeman@free.com"
  }) {
    id
    name
  }
}

# results:
{
  "data": {
    "createUser": {
      "id": "47afd124-0c06-4e2e-992f-0b837d4f0d5e",
      "name": "Morgan"
    }
  }
}
```

### Subscriptions

Subscriptions are a little bit different from regular Queries and Mutations. This is a very interesting feature provided by GraphQL that handles the **real time** aspect of modern web.

Think of GraphQL Subscriptions as YouTube subscriptions. Once you are subscribed to YouTube channel, you get notified with the latest news from the channel. Not only you, it's everyone who's subscribed gets notified.

With GraphQL Subscriptions, you can set up quote unquote "channels" on your endpoint with specified types of "content" that these "channels" post. Once data is mutated, you can then "post" the data up to the channel, notifying whoever's subscribed. Here's an example in my code of subscriptions on the comment section of a specific post:

```graphql
# src/schema.graphql
type Subscription {
  comment(postId: ID!): CommentSubscriptionPayload!
}

type CommentSubscriptionPayload {
  mutation: MutationType!
  data: Comment!
}

enum MutationType {
  CREATED
  UPDATED
  DELETED
}
```

There are only two important key points I want to mention here:

1. `type Subscription`
   - New type! use `subscription { }` instead of `mutation { }` for outer-most layer.
2. new keyword `enum`
   - An enum specifies a set of **`Strings`** that you can use throughout your schema.
   - When you define an Enum, you are basically defining a set of **fixed** Strings.

The resolver of GraphQL subscriptions is a bit trickier. Since you are now not only querying or mutating data, but actually setting up a websocket link between the client and the server, you need **pubsub** system on the server-side.

Looking back to index.js, we can now clearly see the initialization of a `PubSub` instance. We then pass it into `context` option in the GraphQLServer.

```javascript
// src/index.js
import { GraphQLServer, PubSub } from 'graphql-yoga'

// ...import...lots...of...files...

const pubsub = new PubSub()

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers: {
    Query,
    Mutation,
    Subscription,
    User,
    Post,
    Comment
  },
  context: {
    db,
    pubsub
  }
})
```

Now you may wonder what the `context` option is for. If you look closely to resolver functions of the multiple examples above, you may notice a sequence of <i>weird</i> function arguments `parent`, `args`, `context` and `info`. This is where the `context` keyword comes in play. By passing both the `pubsub` instance and `db` into `context`, we can use them within our resolvers later on.

However, the PubSub system isn't as easily set up as you thought. In order to set up _websocket channels_ for each GraphQL Subscription, you need to set up a required `Subscription` resolver like the one below.

```javascript
// src/resolvers/Subscription.js
const Subscription = {
  comment: {
    subscribe(parent, { postId }, { db, pubsub }, info) {
      const post = db.posts.find(post => post.id === postId && post.published)

      if (!post) {
        throw new Error('Post not found')
      }

      return pubsub.asyncIterator(`comment ${postId}`)
    }
  }
}

export { Subscription as default }
```

Here I directly destructure `db` and `pubsub` out of `context`, and extract `postId` from the original argument `arguments`. I then check if the post exists or not. If it doesn't, I throw an Error to the console. If it does exit, and here comes the tricky part, I create and return a `pubsub asyncIterator` with a specific tag of `comment ${postId}`. You can think of this with the YouTube subscription example. Creating an `asyncIterator` is like creating a new YouTube channel. Later on you can then post data onto `pubsub` with the specific _channel tag_, and the data will be broadcasted to all instances connected.

With the `pubsub` system set up, I can now broadcast data throughout all of my resolvers. For example, whenever a comment on a specific post is created, I want to post the comment data onto the comment's individual Subscription Channel. I can do that with the code below:

```javascript
// src/resolvers/Mutation.js
...
const comment = {
    id: uuidv4(),
    ...args.data
}

// THIS IS WHERE I PUBLISH MY DATA TO THE CHANNEL
pubsub.publish(`comment ${args.data.post}`, {
    comment: {
        mutation: 'CREATED',
        data: comment
    }
})
...
```

To sum up, here's a quick example of how GraphQL subscriptions work:

```graphql
# subscription:
subscription {
  comment (postId: 10) {
    mutation
    data {
      text
      author {
        name
      }
    }
  }
}

# mutation that was run after subscription:
mutation {
  createComment(data: {
    text: "Hello sir! Nice Post!"
    author: 1
    post: 10
  }) {
    text
    author {
      name
    }
  }
}

# results on subscription side:
{
  "data": {
    "comment": {
      "mutation": "CREATED",
      "data": {
        "text": "Hello sir! Nice Post!",
        "author": {
          "name": "Andrew"
        }
      }
    }
  }
}
```

## Apollo Client

### TODO

## Wrapping Up

## References

https://medium.com/devgorilla/what-is-graphql-f0902a959e4
https://www.udemy.com/graphql-bootcamp/
