import type { DefaultSession } from "@auth/core/types";
import { Role } from "@prisma/client";

declare module "@auth/core/types" {
  interface Session {
    user: {
      id: string;
      role: Role;
    } & DefaultSession["user"];
  }

  // Extend both sides of the User | AdapterUser union
  interface User {
    id: string;
    role: Role;
  }

  interface AdapterUser {
    id: string;
    role: Role;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id: string;
    role: Role;
  }
}