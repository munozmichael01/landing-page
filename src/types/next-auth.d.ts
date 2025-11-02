import 'next-auth';

declare module 'next-auth' {
  interface User {
    id: string;
    isNewUser?: boolean;
  }

  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      isNewUser?: boolean;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    isNewUser?: boolean;
  }
}

