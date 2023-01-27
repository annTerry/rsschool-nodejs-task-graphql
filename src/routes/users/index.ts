import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import {
  createUserBodySchema,
  changeUserBodySchema,
  subscribeBodySchema,
} from './schemas';
import type { UserEntity } from '../../utils/DB/entities/DBUsers';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (request, reply): Promise<UserEntity[]> {
    return fastify.db.users.findMany();
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity | null> {
      const data = await fastify.db.users.findOne({key:'id', equals: request.params.id});
      if (data === null) {
        reply.statusCode = 404;
      }
      return data;
    }
  );

  fastify.post(
    '/',
    {
      schema: {
        body: createUserBodySchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      reply.statusCode = 400;
      return fastify.db.users.create(request.body);
    }
  );

  fastify.delete(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const baseId = request.params.id
      const allUsersForSubscribe = await fastify.db.users.findMany({key:'subscribedToUserIds', inArray:baseId});
      
      for(const inUser of allUsersForSubscribe) {
        let subscribers = inUser.subscribedToUserIds.filter(data => data !=baseId);
        inUser.subscribedToUserIds = subscribers;
        await fastify.db.users.change(inUser.id, inUser);
      }

      const allPosts = await fastify.db.posts.findMany({key:'userId', equals:baseId});
      for(const postToDel of allPosts) {
        await fastify.db.posts.delete(postToDel.id);
      }

      const profilesToDel = await fastify.db.profiles.findMany({key:'userId', equals:baseId});
      for(const profileToDel of profilesToDel) {
        await fastify.db.profiles.delete(profileToDel.id);
      }

      reply.statusCode = 400;
      return fastify.db.users.delete(request.params.id);
    }
  );

  fastify.post(
    '/:id/subscribeTo',
    {
      schema: {
        body: subscribeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity | null> {

      const hostId = request.body.userId;
      const editId = request.params.id;
      const data = await fastify.db.users.findOne({key:'id', equals: hostId});
      if (data === null) {
        reply.statusCode = 404;
        return null;
      }
      else {
        reply.statusCode = 400;
        data.subscribedToUserIds.push(editId);
        return fastify.db.users.change(hostId, data);
      }
    }
  );

  fastify.post(
    '/:id/unsubscribeFrom',
    {
      schema: {
        body: subscribeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity | null> {
      const hostId  = request.body.userId;
      const editId = request.params.id;
      const data = await fastify.db.users.findOne({key:'id', equals: hostId});
      if (data === null) {
        reply.statusCode = 404;
        return null;
      }
      else {
        if (data.subscribedToUserIds.indexOf(editId) > -1) {
        reply.statusCode = 400;
        data.subscribedToUserIds = data.subscribedToUserIds.filter(data => data != editId);
        return fastify.db.users.change(hostId, data);
      }
      else {
        reply.statusCode = 400;
        return null;
      }
      }
    }
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changeUserBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      reply.statusCode = 400;
      return fastify.db.users.change(request.params.id, request.body);
    }
  );
};

export default plugin;
