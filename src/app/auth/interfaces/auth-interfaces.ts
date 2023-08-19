export interface AuthResponse {
    ok: boolean;
    uid?: string;
    name?: string;
    email?: string;
    token?: string;
    msg?: string;
}

export interface User {
    uid: string;
    name: string;
    email: string;
};