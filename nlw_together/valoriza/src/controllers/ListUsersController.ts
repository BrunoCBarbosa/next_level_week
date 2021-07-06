import { response } from "express";
import { ListUsersService } from "../services/ListUsersService"

class ListUsersController{

    async handle(){
        const listUsersService = new ListUsersService() ;
        
        const users = await listUsersService.execute();

        return response.json(users)
    }
}

export { ListUsersController} 