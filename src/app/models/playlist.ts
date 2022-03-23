export class Playlist {
    owner: string;
    id: number;
    name: string;
    canRead: string[];
    canWrite: string[];

    constructor(name: string, id? : string) {
        this.name = name;
    }
}
