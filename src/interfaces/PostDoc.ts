import mongoose from "mongoose";

export interface PostDoc extends mongoose.Document {
    userId: string;
    description: string;
    img: string;
    likes: Array<string>;
}
