type RelationshipEnum = 1 | 2 | 3;

export interface RequestUser {
    userId: string;
    password: string;
    username?: string;
    email?: string;
    newPassword?: string;
    profilePicture?: string;
    coverPicture?: string;
    followers?: Array<string>;
    following?: Array<string>;
    isAdmin?: boolean;
    description?: string;
    city?: string;
    from?: string;
    relationship?: RelationshipEnum;
}
