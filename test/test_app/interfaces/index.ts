export interface User {
    id: number;
    email: string;
    givenName: string;
    familyName: string;
    isBanned: boolean;
}

export type NewUser = Pick<User, "email"|"givenName"|"familyName"|"isBanned">;
