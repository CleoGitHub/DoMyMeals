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

  checkPasswords: ValidatorFn = (group: AbstractControl):  ValidationErrors | null => { 
    let canRead = group.get('canRead').value;
    let canWrite = group.get('canWrite').value
    return canRead || canWrite ? null : { notSame: true }
  }

  shareForm: FormGroup

  constructor(private fb: FormBuilder, private modalController: ModalController, private playlistService: PlaylistService) {
    this.shareForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      canRead: [true],
      canWrite: [false], 
    },
    {
      validators: [this.checkPasswords.bind(this)]
    });
  }

  ngOnInit() {}

  share(){
    this.playlistService.sharePlaylist(this.playlist, this.shareForm.get('email').value, this.shareForm.get('canRead').value, this.shareForm.get('canWrite').value);
    this.modalController.dismiss();
  }

}
