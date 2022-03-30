import { Injectable } from '@angular/core';
import { Playlist } from '../models/playlist';
import { Todo } from '../models/todo';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { map, switchMap } from 'rxjs/operators';
import { combineLatest, Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { ToastController } from '@ionic/angular';
@Injectable({
  providedIn: 'root'
})
export class PlaylistService {

  MAX_RETRY_ATTEMPTS : number = 5;

  constructor(
    private afs: AngularFirestore,
    private auth: AuthService,
    private toastController: ToastController
    ) {}

  getAll(): Observable<Playlist[]> {
    let collectionsOwned = this.afs.collection<Playlist>('playlists', ref => ref.where("owner", "==", this.auth.getConnectedUserAsValue().uid)).valueChanges({idField: 'id'});
    let collectionsCanRead = this.afs.collection<Playlist>('playlists', ref => ref.where("canRead", "array-contains", this.auth.getConnectedUserAsValue().email)).valueChanges({idField: 'id'});
    let collectionsCanWrite = this.afs.collection<Playlist>('playlists', ref => ref.where("canWrite", "array-contains", this.auth.getConnectedUserAsValue().email)).valueChanges({idField: 'id'});

    return combineLatest([collectionsOwned, collectionsCanRead, collectionsCanWrite]).pipe(
      map(results => {
        let owned = results[0];
        let sharedAsReader = results[1];
        let sharedAsWriter = results[2];
        return [...owned, ...sharedAsReader, ...sharedAsWriter].reduce(
          (arrayAccumulateur, currentValue) => { return arrayAccumulateur.filter(el => el.id == currentValue.id).length == 0 ?  arrayAccumulateur.concat(currentValue) : arrayAccumulateur }
          ,[]
        );
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
    playlist.owner = this.auth.getConnectedUserAsValue().uid;
    this.afs.collection<Playlist>('playlists').add(Object.assign({}, playlist)).then
    (() => {
      this.toastController.create({
        message: 'Playlist créée',
        duration: 3000,
        color: 'success'
      }).then(toast => toast.present());
    });
  }

  removePlaylist(playlistId: string) {
    this.afs.collection<Todo>("playlists/" + playlistId + "/todos").get().toPromise().then((querySnapshot) => {
      Promise.all(querySnapshot.docs.map((doc) => doc.ref.delete())).then(() => {
        this.afs.doc<Playlist>("/playlists/" + playlistId).ref.delete().then
        (() => {
          this.toastController.create({
            message: 'Playlist supprimée',
            duration: 3000,
            color: 'success'
            }).then(toast => toast.present());
          });
      }).catch(error => {
        this.toastController.create({
          message: 'Erreur lors de la suppression de la playlist',
          duration: 3000,
          color: 'danger'
          }).then(toast => toast.present());
      });
    })
  }

  sharePlaylist(playlist : Playlist, email, shareAccess) {
    if (!shareAccess && playlist.canRead.indexOf(email) == -1)
      playlist.canRead.push(email);
    
    if (shareAccess && playlist.canWrite.indexOf(email) == -1)
      playlist.canWrite.push(email);


    this.afs.doc<Playlist>('playlists/' + playlist.id).set(Object.assign({}, playlist)).catch(error => {
      this.toastController.create({
        message: 'Erreur lors de la modification de la playlist',
        duration: 3000,
        color: 'danger'
        }).then(toast => toast.present());
    });
  }

  addTodo(playlistId: string, todo: Todo) {
    this.afs.collection<Todo>('playlists/' +  playlistId + '/todos').add(Object.assign({}, todo))
    .catch(error => {
      this.toastController.create({
        message: 'Erreur lors de l\'ajout du todo',
        duration: 3000,
        color: 'danger'
        }).then(toast => toast.present());
    });
  }

  updateTodo(playlistId : string, todoId: string, todo : Todo) {
    this.afs.doc<Todo>('playlists/' +  playlistId + '/todos/' + todoId).set(Object.assign({}, todo))
    .catch(error => {
      this.toastController.create({
        message: 'Erreur lors de la modification du todo',
        duration: 3000,
        color: 'danger'
        }).then(toast => toast.present());
    })
  }

  removeTodo(playlistId: string, todoId: string) {
    this.afs.doc<Todo>('playlists/' + playlistId + '/todos/' + todoId).delete().catch(error => {
      this.toastController.create({
        message: 'Erreur lors de la suppression du todo',
        duration: 3000,
        color: 'danger'
        }).then(toast => toast.present());
    });
  }
}
