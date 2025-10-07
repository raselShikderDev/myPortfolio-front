import { IBlog } from "./blogs.interfaces";
import { IProject } from "./projects.interfaces";
import { IWorkExperince } from "./workExperience";

export enum isActive {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  BLOCKED = "BLOCKED",
}

export enum Role {
  OWNER = "OWNER",
  MANAGER = "MANAGER",
}

export interface IUser {
  id: number;
  name: string;
  email: string;
  password: string;
  avater: string;
  skills: string[];
  address: string;
  phone: string;
  isActive: isActive;
  role: Role;
  isVerified: boolean;
  github: string;
  linkedin: string;
  twitter: string;
  createdAt: Date;
  updatedAt: Date;
  Blog?: IBlog[];
  Project?: IProject[];
  WorkExperince?: IWorkExperince[];
}
