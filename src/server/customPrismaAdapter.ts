import {PrismaAdapter} from "@next-auth/prisma-adapter";
import {PrismaClient} from "@prisma/client"
import {Adapter, AdapterSession, AdapterUser} from "next-auth/adapters"

export function CustomPrismaAdapter(p: PrismaClient): Adapter {
  const {createUser, getUser, getSessionAndUser, ...adapter} = PrismaAdapter(p);

  return {
    async createUser(data) {
      const {tenant: _, ...userData} = data;

      // TODO: get real tenant
      const tenant = await p.tenant.findFirstOrThrow({
        where: {
          name: 'internal',
        },
      });

      const user = {
        ...userData,
        tenantId: tenant.id,
      };

      const newUser = await p.user.create({data: user});

      return {
        ...newUser,
        tenant,
      } as AdapterUser;
    },
    async getUser(id: string) {
      const user = await p.user.findUnique({
        where: {
          id,
        },
        include: {
          tenant: true,
        },
      });

      return user as AdapterUser;
    },
    async getSessionAndUser(sessionToken) {
      const userAndSession = await p.session.findUnique({
        where: {sessionToken},
        include: {
          user: {
            include: {
              tenant: true,
            },
          }
        },
      });

      if (!userAndSession) return null

      const {user, ...session} = userAndSession
      return {user, session} as {user: AdapterUser, session: AdapterSession};
    },
    ...adapter
  };
}
