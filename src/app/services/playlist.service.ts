import { Injectable } from '@angular/core';
import { Playlist } from '../models/playlist';
import { Todo } from '../models/todo';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { map, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
// import { getFirestore } from "firebase-admin/firestore";


@Injectable({
  providedIn: 'root'
})
export class PlaylistService {

  collection : AngularFirestoreCollection<Playlist> = null;
  // adminFirestore : FirebaseFirestore.Firestore;
  MAX_RETRY_ATTEMPTS : number = 5;

  constructor(
    private afs: AngularFirestore
  ) {
      this.collection = this.afs.collection<Playlist>('playlists');
      // this.adminFirestore = getFirestore()
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
    // const bulkWriter = this.adminFirestore.bulkWriter();
    // bulkWriter
    // .onWriteError((error) => {
    //   if (
    //     error.failedAttempts < this.MAX_RETRY_ATTEMPTS
    //   ) {
    //     return true;
    //   } else {
    //     console.log('Failed write at document: ', error.documentRef.path);
    //     return false;
    //   }
    // });
    // this.adminFirestore.recursiveDelete(this.adminFirestore.doc('playlists/' + playlistId), bulkWriter)
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
