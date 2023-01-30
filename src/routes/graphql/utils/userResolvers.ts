import { FastifyInstance } from "fastify";

export const usersResolver = async function(fastify:FastifyInstance ) {
  const allUsers = await fastify.db.users.findMany();
  console.log(allUsers);
  return JSON.stringify(allUsers);
 }
 
 export const oneUserResolver = async function(fastify:FastifyInstance, id:string ) {
  
  const data = await fastify.db.users.findOne({key:'id', equals: id});
  if (data === null) {
    return null
  }
  return JSON.stringify(data);
 }