export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email?: string;
  password?: string;
  role: 'user' | 'admin' | 'super-admin';
  status: 'active' | 'inactive';
}

export interface Contact {
  _id: string;
  firstName: string;
  lastName: string;
  contactNumber: string;
  emailAddress: string;
  photo?: string;
  owner: string; // ObjectId as string
  sharedWith: {
    userId: string;
    email: string;
  }[];
}