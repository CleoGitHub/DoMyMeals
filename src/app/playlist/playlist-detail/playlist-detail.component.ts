import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { CreateTodoComponent } from 'src/app/modals/create-todo/create-todo.component';
import { Playlist } from 'src/app/models/playlist';
import { Todo } from 'src/app/models/todo';
import { PlaylistService } from 'src/app/services/playlist.service';
import { EMPTY, Observable } from 'rxjs';
import { SharePlaylistComponent } from 'src/app/modals/share-playlist/share-playlist.component';

@Component({
  selector: 'app-playlist-detail',
  templateUrl: './playlist-detail.component.html',
  styleUrls: ['./playlist-detail.component.css']
})
export class PlaylistDetailComponent implements OnInit {

  public playlist$: Observable<Playlist> = EMPTY;
  public todos$: Observable<Todo[]> = EMPTY;

  constructor(private route: ActivatedRoute,
    private playlistService: PlaylistService,
    private modalController: ModalController) { }

  ngOnInit(): void {
    this.playlist$ = this.playlistService.getOne(this.route.snapshot.params.id);
  }

  updateTodo(playlistId : string, todo : Todo)
  {
    this.playlistService.updateTodo(playlistId, todo.id, todo)
  }

  delete(playlistId : string, todoId : string) {
    this.playlistService.removeTodo(playlistId, todoId);
  }

  async openModal(playlistId : string, todo : Todo) {
    const modal = await this.modalController.create({
      component: CreateTodoComponent,
      componentProps: {
        playlistId: playlistId,
        todo: todo
      }
    });
    await modal.present();
  }

  async openShareModal(playlist : Playlist) {
    const modal = await this.modalController.create({
      component: SharePlaylistComponent,
      componentProps: {
        playlist: playlist,
      }
    });
    await modal.present();
  }

}
