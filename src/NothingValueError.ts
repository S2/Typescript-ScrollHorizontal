class NothingValueError{
    message : string;
    code : number = 100;

    constructor(message : string){
        this.message = message;
    }

    public getCode():number{
        return this.code;
    }
}
