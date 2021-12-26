export class Player {
    private _name: string;
    public get name(): string {
        return this._name;
    }
    public set name(value: string) {
        this._name = value;
    }
    constructor(n:string){
        this._name= n
    }

}
