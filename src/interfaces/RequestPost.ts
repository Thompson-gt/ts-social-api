// will be the shape of the req.body when clients wish send post data
// doesnt need the postId in this because it should be provided in the req.params

export interface RequestPost {
    userId: string;
    isAdmin?: string;
    description?: string;
    img?: string;
}
