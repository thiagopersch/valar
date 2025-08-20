import 'next-auth';

declare module 'next-auth' {
  interface Session {
    token: string;
    user: {
      id: string;
      image?: string;
      token: string;
      name: string;
      email: string;
      password: string;
      change_password: boolean;
      status: boolean;
      coligate_id?: string;
      client_id?: string;
    };
  }

  interface User extends User {
    id: string;
    token: string;
    image?: string;
    name: string;
    email: string;
    password: string;
    change_password: boolean;
    status: boolean;
    coligate_id?: string;
    client_id?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    token: string;
    image?: string;
    name: string;
    email: string;
    password: string;
    change_password: boolean;
    status: boolean;
    coligate_id?: string;
    client_id?: string;
  }
}
