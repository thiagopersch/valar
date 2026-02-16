export interface User {
  id: string;
  name: string;
  email: string;
  email_verified_at: string;
  change_password: boolean;
  status: boolean;
  coligate_id: string;
  client_id: string;
  created_by: User;
  updated_by: User;
  created_at: string;
  updated_at: string;
  deleted_at: string;
}
