import { db } from ".";
import { server } from "./schema";

export const getAllServers = async () => await db.select().from(server);
