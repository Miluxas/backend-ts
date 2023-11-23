export interface IUserInfo {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    active: boolean;
    emailVerified: boolean;
    avatarUrl?: string;
}
