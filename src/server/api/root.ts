import { createTRPCRouter } from "./trpc";

import { exampleRouter } from "./routers/example";
import { formRouter } from "./routers/form";
import { adminRouter } from "./routers/admin";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  form: formRouter,
  admin: adminRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
