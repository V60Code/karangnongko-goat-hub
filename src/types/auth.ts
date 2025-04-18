
export interface AuthUser {
  id: string;
  username: string;
  role: 'admin' | 'barat' | 'timur';
}

export interface LoginCredentials {
  username: string;
  password: string;
}
