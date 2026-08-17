import {
    getAllUsers
} from "../repositories/userRepository";

export async function getUsers() {
    return await getAllUsers();
}