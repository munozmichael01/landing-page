import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Verificar usuario en backend
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          if (response.ok) {
            const userData = await response.json();
            return {
              id: userData.user.id.toString(),
              email: userData.user.email,
              name: userData.user.name,
              image: userData.user.image,
            };
          }
        } catch (error) {
          console.error('Error en authorize:', error);
        }
        
        return null;
      }
    })
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async signIn({ user, account }) {
      // Aquí podríamos registrar el usuario en nuestra base de datos
      if (account?.provider === 'google') {
        try {
          // Llamar al backend para registrar/autenticar usuario
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/google`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: user.email,
              name: user.name,
              image: user.image,
              googleId: account.providerAccountId,
            }),
          });

          if (response.ok) {
            const userData = await response.json();
            // Agregar datos adicionales al usuario
            user.id = userData.user.id;
            user.isNewUser = userData.isNewUser;
            return true;
          }
        } catch (error) {
          console.error('Error registrando usuario:', error);
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.isNewUser = user.isNewUser;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.isNewUser = token.isNewUser as boolean;
      }
      return session;
    },
  },
  session: {
    strategy: 'jwt',
  },
})

export { handler as GET, handler as POST }