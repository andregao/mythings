import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatCheckboxChange } from '@angular/material';
import { Todo } from '../../../shared/models/todo.model';
import { Project } from '../../../shared/models/project.model';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { AppService } from '../../../core/app.service';

@Component({
  selector: 'mt-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.scss']
})
export class ListsComponent implements OnInit, OnChanges {

  activeTodos: Todo[];
  completedTodos: Todo[];
  newTodo: Todo;
  expansionControl: {[todoId: string]: boolean} = {};

  @Input() currentProject: Project;
  @Input() activeProjects: Project[];
  @Input() todos: Todo[];
  @Input() todoIds: string[];
  @Output() todoCheckboxChange = new EventEmitter();
  @Output() addTodo = new EventEmitter<Todo>();
  @Output() editTodo = new EventEmitter<Todo>();
  @Output() deleteTodo = new EventEmitter<string>();
  @Output() reorderTodos = new EventEmitter<string[]>();
  @Output() updateProjectInfo = new EventEmitter<Project>();
  @Output() deleteProject = new EventEmitter<void>();

  constructor(private appService: AppService) {
  }

  ngOnInit() {
    this.initializeNewTodo();
  }

  initializeNewTodo() {
    this.newTodo = {title: '', completed: false};
  }

  ngOnChanges(changes: SimpleChanges): void {
    // console.log('List component', changes);
    if (changes.currentProject && changes.currentProject.currentValue) {
      this.clearListsDisplay();
    }

    if (changes.todoIds || changes.todos) {
      if (changes.todoIds && changes.todoIds.currentValue || changes.todos && changes.todos.currentValue) {
        this.appService.stopLoading();
      }
      // sort todoItems only when both items and their order are present
      if (this.todoIds && this.todoIds.length && this.todos && this.todos.length) {
        this.sortTodos();
      }
    }


  }

  clearListsDisplay(): void {
    // console.log('clearing lists display');
    this.completedTodos = [];
    this.activeTodos = [];
  }

  clearTodoList(): void {
    // console.log('clearing todo list and order');
    this.todos = [];
    this.todoIds = [];
  }

  // todoItems
  sortTodos() {
    this.clearListsDisplay();
    // console.log('sorting todos');
    const activeTodos = [];
    const completedTodos = [];
    this.todoIds.forEach(id => {
      const todo = this.todos.find(t => t.id === id);
      if (todo && !todo.completed) {
        activeTodos.push(todo);
      } else {
        completedTodos.unshift(todo);
      }
    });
    // sort the most recent first
    // if (completedTodos.length > 1) {
    //   completedTodos.sort((a, b) => {
    //     return b.completionDate.seconds - a.completionDate.seconds;
    //   });
    // }

    // limit the number of items
    this.activeTodos = activeTodos;
    this.completedTodos = completedTodos.slice(0, 20);
    this.appService.stopLoading();
  }

  onTodoCheckboxChange(id: string, change: MatCheckboxChange) {
    this.expansionControl[id] = false; // closes the expansion panel
    this.todoCheckboxChange.emit({id, completed: change.checked});
  }

  onAddTodo() {
    if (this.newTodo.title) {
      this.addTodo.emit(this.newTodo);
    }
    this.clearTodoList();
    this.initializeNewTodo();
  }

  onEditTodo(todo: Todo) {
    this.expansionControl[todo.id] = false; // closes the expansion panel
    this.editTodo.emit(todo);
  }

  onDeleteTodo(id: string) {
    this.deleteTodo.emit(id);
  }

  onTodoDrop(event: CdkDragDrop<Todo[]>) {
    if (event.previousIndex !== event.currentIndex) {
      moveItemInArray(this.activeTodos, event.previousIndex, event.currentIndex);
      this.reorderTodos.emit(this.reorderTodoIds());
    }
  }

  reorderTodoIds(): string[] {
    const newTodoIds: string[] = [];
    this.activeTodos.forEach(todo => newTodoIds.push(todo.id));
    if (this.completedTodos && this.completedTodos.length) {
      this.completedTodos.forEach(todo => newTodoIds.push(todo.id));
    }
    return newTodoIds;
  }

  // Projects
  onSaveProjectInfo() {
    this.appService.startLoading();
    const projectInfo: Project = {};
    projectInfo.id = this.currentProject.id;
    projectInfo.title = this.currentProject.title;
    projectInfo.completed = this.currentProject.completed;
    projectInfo.notes = this.currentProject.notes;
    this.updateProjectInfo.emit(projectInfo);
  }

  onDeleteProject() {
    if (confirm('This will delete the project and all its associated items')) {
      this.deleteProject.emit();
    }
  }
}
