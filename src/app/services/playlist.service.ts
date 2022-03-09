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
  MAX_RETRY_ATTEMPTS : number = 5;

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
    this.afs.collection<Playlist>('playlists').add(Object.assign({}, playlist))
  }

  removePlaylist(playlistId: string) {
    this.afs.collection<Todo>("playlists/" + playlistId + "/todos").get().toPromise().then((querySnapshot) => {
      Promise.all(querySnapshot.docs.map((doc) => doc.ref.delete())).then(() => {
        this.afs.doc<Playlist>("/playlists/" + playlistId).ref.delete();
      });
    })
  }

  addTodo(playlistId: string, todo: Todo) {
    this.afs.collection<Todo>('playlists/' +  playlistId + '/todos').add(Object.assign({}, todo))
    .catch(error => console.log("error", error))
  }

  updateTodo(playlistId : string, todoId: string, todo : Todo) {
    this.afs.doc<Todo>('playlists/' +  playlistId + '/todos/' + todoId).set(Object.assign({}, todo))
    .catch(error => console.log("error", error))
  }

  removeTodo(playlistId: string, todoId: string) {
    this.afs.doc<Todo>('playlists/' + playlistId + '/todos/' + todoId).delete()
  }
}
