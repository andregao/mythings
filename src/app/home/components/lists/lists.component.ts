import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Todo } from '../../../shared/models/todo.model';
import { Project } from '../../../shared/models/project.model';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { AppService } from '../../../core/app.service';
import { currentProjectId } from '../../reducers';

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
  @Output() editTodo = new EventEmitter<{todo: Todo, fromProject: string}>();
  @Output() deleteTodo = new EventEmitter<Todo>();
  @Output() reorderTodos = new EventEmitter<{todoIds: string[], projectId: string}>();
  @Output() updateProjectInfo = new EventEmitter<Project>();
  @Output() deleteProject = new EventEmitter<string>();

  constructor() {
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
      }
      // sort todoItems only when both items and their order are present
      if (this.todoIds && this.todoIds.length && this.todos && this.todos.length) {
        this.sortTodos();
      }
    }

  }

  clearListsDisplay(): void {
    this.completedTodos = [];
    this.activeTodos = [];
  }

  clearTodoList(): void {
    this.todos = [];
    this.todoIds = [];
  }

  closeAllExpansions() {
    Object.keys(this.expansionControl).forEach(
      key => this.expansionControl[key] = false
    );
  }

  // todoItems
  sortTodos() {
    // console.log('sorting todos');
    this.clearListsDisplay();
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

    // limit the number of completed items
    this.activeTodos = activeTodos;
    this.completedTodos = completedTodos.slice(0, 20);
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
    this.editTodo.emit({todo, fromProject: this.currentProject.id});
  }

  onDeleteTodo(todo: Todo) {
    this.deleteTodo.emit(todo);
  }

  onTodoDrop(event: CdkDragDrop<Todo[]>) {
    if (event.previousIndex !== event.currentIndex) {
      this.closeAllExpansions();
      moveItemInArray(this.activeTodos, event.previousIndex, event.currentIndex);
      const newTodoIds: string[] = [];
      if (this.completedTodos && this.completedTodos.length) {
        this.completedTodos.forEach(todo => newTodoIds.unshift(todo.id));
      }
      this.activeTodos.forEach(todo => newTodoIds.push(todo.id));
      this.reorderTodos.emit({todoIds: newTodoIds, projectId: this.currentProject.id});
    }
  }

  // Projects
  onSaveProjectInfo() {
    const projectInfo: Project = {};
    projectInfo.id = this.currentProject.id;
    projectInfo.title = this.currentProject.title;
    projectInfo.completed = this.currentProject.completed;
    projectInfo.notes = this.currentProject.notes;
    this.updateProjectInfo.emit(projectInfo);
  }

  onDeleteProject() {
    if (confirm('This will delete the project and all its associated items')) {
      this.deleteProject.emit(this.currentProject.id);
    }
  }
}
