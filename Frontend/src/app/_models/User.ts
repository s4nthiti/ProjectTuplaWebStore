import { Role } from "./role";

export class User {
    userName!: string;
    firstName!: string;
    lastName!: string;
    email!: string;
    dateofbirth!: Date;
    phoneNumber: any;
    imgProfileUrl: any;
    role!: Role;
}