import { IUser } from "./user.interfaces";

export interface IProject {
  id?: number;
  title: string;
  description: string;
  image: string;
  techStack: string[];
  liveUrl: string;
  githubUrl: string;
  userId: number;
  user?: IUser;
  createdAt?: Date;
  updatedAt?: Date;
}
