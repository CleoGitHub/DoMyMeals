import { Injectable } from '@angular/core';
import { Playlist } from '../models/playlist';
import { Todo } from '../models/todo';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { map, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class PlaylistService {

  collection : AngularFirestoreCollection<Playlist> = null;

  constructor(
    private afs: AngularFirestore
  ) {
      this.collection = this.afs.collection<Playlist>('playlists');
  }

  getAll() {
    return this.collection.valueChanges({idField: 'id'});
  }

  getOne(id: string): Observable<Playlist> {
    const doc =  this.collection.doc<Playlist>(id);
    const todosCollection = doc.collection<Todo>('todos');
    return doc.valueChanges({idField: 'id'}).pipe(
      switchMap(playlist => todosCollection.valueChanges({idField: 'id'}).pipe(
        map(todos => ({
          ...playlist,
          todos
        }))
      ))
    );
  }

  addPlaylist(playlist: Playlist) {
    // this.playlists = this.playlists.concat(playlist);
  }

  removePlaylist(playlist: Playlist) {
    // this.playlists = this.playlists.filter(p => p.id !== playlist.id);
  }

  addTodo(playlistId: string, todo: Todo) {
    this.collection.doc<Playlist>(playlistId).collection<Todo>('todos').add({
      name: 'test',
      description: 'test',
      isDone: false
    })
    .then(response => console.log(response))
    .catch(error => console.log(error))
  }

  removeTodo(playlistId: number, todo: Todo) {
    // const playlistIndex = this.playlists.findIndex(p => p.id === playlistId);
    // if (this.playlists[playlistIndex]) {
    //   this.playlists[playlistIndex].todos = this.playlists[playlistIndex].todos.filter(t => t.id !== todo.id);
    // }
  }
}
