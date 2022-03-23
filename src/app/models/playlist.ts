export class Playlist {
    owner: string;
    id: number;
    name: string;

    constructor(name: string, id? : string) {
        this.name = name;
    }
}
