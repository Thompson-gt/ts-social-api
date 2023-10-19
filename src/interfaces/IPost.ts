export interface IPost {
    postId: string;
    userId: string;
    description: string;
    img: string;
    likes: Array<string>; // will be a array of the userID
}
