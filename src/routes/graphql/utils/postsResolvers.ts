import { FastifyInstance } from "fastify";

export const postsResolver = async function(fastify:FastifyInstance ) {
  const allProfiles = await fastify.db.posts.findMany();
  return JSON.stringify(allProfiles);
 }