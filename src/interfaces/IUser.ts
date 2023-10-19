type RelationshipEnum = 1 | 2 | 3;

export interface IUser {
    userId: string;
    username: string;
    email: string;
    password: string;
    profilePicture: string;
    coverPicture: string;
    followers: Array<string>;
    following: Array<string>;
    isAdmin: boolean;
    description: string;
    city: string;
    from: string;
    relationship: RelationshipEnum;
}
