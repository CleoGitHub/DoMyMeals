import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlaylistDetailComponent } from './playlist-detail.component';
import { PlaylistDetailRoutingModule } from './playlist-detail-routing.module';
import { IonicModule } from '@ionic/angular';
import { CreateTodoComponent } from 'src/app/modals/create-todo/create-todo.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharePlaylistComponent } from 'src/app/modals/share-playlist/share-playlist.component';


@NgModule({
  declarations: [
    PlaylistDetailComponent,
    CreateTodoComponent,
    SharePlaylistComponent,
  ],
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    PlaylistDetailRoutingModule,
    FormsModule
  ]
})
export class PlaylistDetailModule { }
