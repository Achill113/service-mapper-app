import {createTRPCRouter, protectedProcedure} from "../trpc";

import {z} from "zod";

export const serviceRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({
      name: z.string(),
      tenantId: z.string(),
      version: z.string().optional(),
    }))
    .mutation(({input, ctx}) => {
      if (input.version) {
        return ctx.prisma.service.create({
          data: {
            name: input.name,
            tenantId: input.tenantId,
            serviceVersions: {
              create: [
                {
                  version: input.version,
                }
              ]
            }
          },
          include: {
            serviceVersions: true
          }
        });
      } else {
        return ctx.prisma.service.create({
          data: {
            name: input.name,
            tenantId: input.tenantId,
          },
        });
      }
    }),

  getAll: protectedProcedure
    .query(({ctx}) => {
      return ctx.prisma.service.findMany();
    })
});
