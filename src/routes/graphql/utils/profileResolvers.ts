import { FastifyInstance } from "fastify";

export const profilesResolver = async function(fastify:FastifyInstance ) {
  const allProfiles = await fastify.db.profiles.findMany();
  return JSON.stringify(allProfiles);
 }