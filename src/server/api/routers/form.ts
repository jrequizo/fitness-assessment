import { count } from "console";
import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const formRouter = createTRPCRouter({
  create: publicProcedure
    .input(z.object({
      givenName: z.string(),
      surname: z.string(),
      gender: z.enum(["Male", "Female", "Unspecified", "N/A"]),
      dob: z.date(),
      height: z.number(),
      weight: z.number(),
    }))
    .mutation(async ({ ctx, input }) => {
      // TODO: add the data to the database
      const result = await ctx.prisma.form.create({
        data: {
          givenName: input.givenName,
          surname: input.surname,
          gender: input.gender,
          dob: input.dob,
          height: input.height,
          weight: input.weight
        }
      });

      return {
        success: true
      }
      // TODO: parse the data

      // TODO: return the parsed data back to the user 

      // return {
      //   greeting: `Hello ${input.name}`,
      // };
    }),

  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.form.findMany();
  }),

  get: protectedProcedure.input(z.object({
    page: z.number(),
    count: z.number(),
  })).query(async ({ input, ctx }) => {
    let skip = (input.page - 1) * input.count;
    // const total = await ctx.prisma.form.count();

    // if (skip > total) {
    //   skip = total - input.count;
    // }

    return await ctx.prisma.form.findMany({
      skip: skip,
      take: input.count,
    })
  }),

  getCount: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.form.count();
  }),
});

