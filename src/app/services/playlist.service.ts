import { Injectable } from '@angular/core';
import { Playlist } from '../models/playlist';
import { Todo } from '../models/todo';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { map, switchMap } from 'rxjs/operators';
import { combineLatest, Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PlaylistService {
  
  MAX_RETRY_ATTEMPTS : number = 5;

  constructor(
    private afs: AngularFirestore,
    private auth: AuthService
    ) {}

  getAll(): Observable<Playlist[]> {
    let collectionsOwned = this.afs.collection<Playlist>('playlists', ref => ref.where("owner", "==", this.auth.getConnectedUserAsValue().email)).valueChanges({idField: 'id'});
    let collectionsCanRead = this.afs.collection<Playlist>('playlists', ref => ref.where("canRead", "array-contains", this.auth.getConnectedUserAsValue().email)).valueChanges({idField: 'id'});; 

    return combineLatest([collectionsOwned, collectionsCanRead]).pipe(
      map(results => {
        let owned = results[0];
        let shared = results[1];
        return owned.concat(shared);
      }
    ));
  }

  getOne(id: string): Observable<Playlist> {
    const doc =  this.afs.collection<Playlist>('playlists').doc<Playlist>(id);
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
