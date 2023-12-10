import { Component, Injector, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

import { Task } from '../../models/task.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  tasks = signal<Task[]>([]);

  filter = signal<'all' | 'pending' | 'completed'>('all');
  tasksByFilter = computed(() => {
    const filter = this.filter();
    const tasks = this.tasks();
    if (filter === 'pending') {
      return tasks.filter( tasks => !tasks.completed );
    }
    if (filter === 'completed') {
      return tasks.filter( tasks => tasks.completed );
    }
    return tasks;
  })

  newTaskCtrl = new FormControl('', {
    nonNullable: true,
    validators: [ Validators.required ]
  });

  injector = inject( Injector )

  ngOnInit() {
    const tasks = localStorage.getItem('tasks');
    if (tasks) {
      this.tasks.update(() => JSON.parse( tasks ));
    }
    this.trackTask();
  }

  trackTask() {
    effect(() => {
      const tasks = this.tasks();
      localStorage.setItem('tasks', JSON.stringify( tasks ));
    }, { injector: this.injector });
  }

  changeHandler() {
    if (this.newTaskCtrl.valid) {
      const value = this.newTaskCtrl.value.trim();
      this.addTask(value);
      this.newTaskCtrl.setValue('');
    }
    
  }

  addTask( title: string ) {
    const newTask = {
      id: Date.now(),
      title,
      completed: false
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
          completed: !task.completed
        }
      }
      return task;
    }));
  }

  updateTaskEditingMode( index: number ) {
    this.tasks.update(( tasks ) => tasks.map(( task, position ) => {
      if ( position === index && !task.completed ) {
        return {
          ...task,
          editing: true
        }
      }
      return {
        ...task,
        editing: false
      }
    }));
  }

  /**
   * Updates the text of a task at the specified index.
   * @param index - The index of the task to update.
   * @param event - The event object triggered by the input element.
   */
  updateTaskText( index: number, event: Event ) {
    const input = event.target as HTMLInputElement;
    this.tasks.update(( tasks ) => tasks.map(( task, position ) => {
      if ( position === index ) {
        return {
          ...task,
          title: input.value,
          editing: false
        }
      }
      return task;
    }));
  }

  /**
   * Filters the tasks based on the specified filter.
   * @param filter - The filter to apply. Can be 'all', 'pending', or 'completed'.
   */
  filterTasks( filter: 'all' | 'pending' | 'completed' ) {
    this.filter.update(() => filter);
  }

  clearComplete() {
    console.log('Cleared complete tasks');
  }

}
