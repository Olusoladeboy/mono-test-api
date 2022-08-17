import { Request } from 'express';

export interface UserInterface {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    linked_account: boolean;
    code: string;
}

export interface IUserRequest extends Request {
    user: any
}

export interface linkaccountInteface {
    code: string
}