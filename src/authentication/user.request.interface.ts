import { UserCredentials } from "./user.credentials";

export interface UserRequest extends Request {
    userData: UserCredentials;
}
