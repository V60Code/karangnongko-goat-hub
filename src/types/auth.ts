
export interface AuthUser {
  id: string;
  username: string;
  role: 'admin' | 'barat' | 'timur';
  name?: string;
  photoUrl?: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}
