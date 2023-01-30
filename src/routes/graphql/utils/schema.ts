import { GraphQLObjectType, GraphQLSchema, GraphQLString} from 'graphql';
import {usersResolver, oneUserResolver} from './userResolvers';
import {profilesResolver} from './profileResolvers'
import { postsResolver } from './postsResolvers';
import { memberTypesResolver } from './memberTypesResolver';
import { FastifyInstance } from 'fastify';

/* const userType = new GraphQLObjectType({
  name: 'user',
  fields: () => ({
    id: {
      type: GraphQLString,
    },
    firstName: {
      type: GraphQLString,
    },
    lastName: {
      type: GraphQLString,
    },
    email: {
      type: GraphQLString,
    },
    subscribedToUserIds: {
      type: new GraphQLList(GraphQLString)
    },
  }),
}); */

export const baseSchema = (fastify:FastifyInstance) => new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      users: {
        type: GraphQLString,
        resolve: async () => {
          return await usersResolver(fastify);
        },
      },
      profiles: {
        type: GraphQLString,
        resolve: async () => {
          return await profilesResolver(fastify);
        },
      },
      posts: {
        type: GraphQLString,
        resolve: async () => {
          return await postsResolver(fastify);
        },
      }, 
      memberTypes: {
        type: GraphQLString,
        resolve: async () => {
          return await memberTypesResolver(fastify);
        },
      },
      user:{
        type: GraphQLString, 
        args: {
        id: {
          type: GraphQLString,
        },
      },
      resolve: async (_source, { id }) => {
        return await oneUserResolver(fastify, id);
      },
    }
  }
})
});