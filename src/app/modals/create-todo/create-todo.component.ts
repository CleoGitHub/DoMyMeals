import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Todo } from 'src/app/models/todo';
import { PlaylistService } from 'src/app/services/playlist.service';

@Component({
  selector: 'app-create-todo',
  templateUrl: './create-todo.component.html',
  styleUrls: ['./create-todo.component.css']
})
export class CreateTodoComponent implements OnInit {

  @Input() playlistId: string;

  @Input() todo: Todo = null;

  todoForm: FormGroup;

  constructor(private fb: FormBuilder, private modalController: ModalController,
    private playlistService: PlaylistService) {
    this.todoForm = this.fb.group({
      name: [ this.todo?.name ?? '', [Validators.required, Validators.minLength(3)]],
      description: [ this.todo?.description ?? '', Validators.maxLength(255)]
    });
  }

  ngOnInit(): void {
    if(this.todo) {
      this.todoForm.setValue({name: this.todo?.name, description: this.todo?.description})
    }
  }

  addTodo() {
    const todo : Todo = new Todo(this.todoForm.get('name').value, this.todoForm.get('description').value);
    if(this.todo) {
      this.playlistService.updateTodo(this.playlistId, this.todo.id, todo);
    } else {
      this.playlistService.addTodo(this.playlistId, todo);
    }
    this.modalController.dismiss();
  }

}
