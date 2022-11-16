export class AuthTokenError extends Error{
    constructor(){
        super('Error with authenticated token')
    }
}