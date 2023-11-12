import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Task } from '../../models/task.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  tasks = signal<Task[]>([
    {
      id: Date.now(),
      title: 'Create application',
      complete: false
    },
    {
      id: Date.now(),
      title: 'Create components',
      complete: false
    }
  ]);

  changeHandler( event: Event ) {
    const input = event.target as HTMLInputElement;
    const newTask = input.value.trim();
    this.addTask(newTask);

    input.value = '';
  }

  addTask( title: string ) {
    const newTask = {
      id: Date.now(),
      title,
      complete: false
    }
    this.tasks.update(( tasks ) => [...tasks, newTask]);
  }

  removeTask( index: number ) {
    this.tasks.update(( tasks ) => tasks.filter(( task, position ) => position !== index));
  }

  updateTask( index: number ) {
    this.tasks.update(( tasks ) => tasks.map(( task, position ) => {
      if ( position === index ) {
        return {
          ...task,
          complete: !task.complete
        }
      }
      return task;
    }));
  }
}
