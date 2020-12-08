import { Role } from "./role";

export class User {
    username!: string;
    firstName!: string;
    lastName!: string;
    email!: string;
    birthdate!: Date;
    phoneNumber: any;
    userIMG: any;
    role!: Role;
}