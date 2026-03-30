import { User } from './user';

export interface System {
  id: string;
  code?: string;
  name?: string;
  fantasy_name?: string;
  description?: string;
  status?: boolean;
  created_at?: string;
  updated_at?: string;
  created_by?: User;
  updated_by?: User;
}
