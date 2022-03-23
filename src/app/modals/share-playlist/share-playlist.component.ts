import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { PlaylistService } from 'src/app/services/playlist.service';
import { Playlist } from 'src/app/models/playlist';

@Component({
  selector: 'app-share-playlist',
  templateUrl: './share-playlist.component.html',
  styleUrls: ['./share-playlist.component.scss'],
})
export class SharePlaylistComponent implements OnInit {
  @Input() playlist: Playlist;


  shareForm: FormGroup

  constructor(private fb: FormBuilder, private modalController: ModalController, private playlistService: PlaylistService) {
    this.shareForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      shareAccess: [true],
    })
    }

  ngOnInit() {}

  share(){
    this.playlistService.sharePlaylist(this.playlist, this.shareForm.get('email').value, this.shareForm.get('shareAccess').value);
    this.modalController.dismiss();
  }

}
