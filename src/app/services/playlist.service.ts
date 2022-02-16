import { Injectable } from '@angular/core';
import { Playlist } from '../models/playlist';
import { Todo } from '../models/todo';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';


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

  getOne(id: string) {
    return this.collection.doc<Playlist>(id).valueChanges();
  }

  addPlaylist(playlist: Playlist) {
    // this.playlists = this.playlists.concat(playlist);
  }

  removePlaylist(playlist: Playlist) {
    // this.playlists = this.playlists.filter(p => p.id !== playlist.id);
  }

  addTodo(playlistId: number, todo: Todo) {
    // const playlistIndex = this.playlists.findIndex(p => p.id === playlistId);
    // if (this.playlists[playlistIndex]) {
    //   this.playlists[playlistIndex].todos = this.playlists[playlistIndex].todos.concat(todo);
    // }
  }

  removeTodo(playlistId: number, todo: Todo) {
    // const playlistIndex = this.playlists.findIndex(p => p.id === playlistId);
    // if (this.playlists[playlistIndex]) {
    //   this.playlists[playlistIndex].todos = this.playlists[playlistIndex].todos.filter(t => t.id !== todo.id);
    // }
  }
}
