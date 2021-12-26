export class Space {
    private _className: string = "";
    private _value: string = "";
    
    public get className(): string {
        return this._className;
    }
    public set className(value: string) {
        this._className = value;
    }
    public get value(): string {
        return this._value;
    }
    public set value(value: string) {
        this._value = value;
    }
    constructor(c:string,v:string){
        this.className=c;
        this.value=v;
    }
}
