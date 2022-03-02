export class Todo {
    name: string;
    description: string;
    isDone: boolean;

    constructor(name: string, description: string, id?: number, isDone?: boolean) {
        this.name = name;
        this.description = description;
        this.isDone = isDone ?? false;
    }
}
