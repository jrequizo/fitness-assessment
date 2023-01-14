import { createHmac } from "crypto";
import { z } from "zod";

import { env } from "../../../env/server.mjs";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

const HASH_SECRET = env.HASH_SECRET || 'SUPER_SECRET_HASH_SECRET'

export const adminRouter = createTRPCRouter({
    // registerUser: publicProcedure
    //     // .input(z.object({
    //     //     email: z.string().email(),
    //     //     password: z.string().min(8).max(96)
    //     // }))
    //     .mutation(async ({ ctx, input }) => {
    //         // TODO: add the data to the database
    //         const passwordHash = createHmac('sha256', HASH_SECRET).update('password').digest('hex');

    //         const result = await ctx.prisma.user.create({
    //             data: {
    //                 password: passwordHash,
    //                 email: 'test@email.com',
    //             }
    //         });

    //         return result;
    //     }),
});

