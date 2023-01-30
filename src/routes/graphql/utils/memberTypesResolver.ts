import { FastifyInstance } from "fastify";

export const memberTypesResolver = async function(fastify:FastifyInstance ) {
  const allMembersTypes = await fastify.db.memberTypes.findMany();
  return JSON.stringify(allMembersTypes);
 }
