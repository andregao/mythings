import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, of, Subscription } from 'rxjs';
import { Todo } from '../../shared/models/todo.model';
import { DataService } from '../../core/data.service';
import { Project } from '../../shared/models/project.model';
import { take, tap } from 'rxjs/operators';
import { AuthService } from '../../core/auth.service';
import { AppService } from '../../core/app.service';


@Component({
  templateUrl: './shell.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShellComponent implements OnInit, OnDestroy {

  // whether to show the completed component
  showCompleted: boolean;

  projectsSub: Subscription;
  todosSub: Subscription;

  // used in filters component
  currentProjectId: string;
  activeProjects: Project[];
  projectIds$: Observable<string[]>;

  // used in lists component
  currentProject$: Observable<Project>;
  todos$: Observable<Todo[]>;
  todoIds$: Observable<string[]>;

  // used in completed component
  allProjects: Project[];
  completedProjects: Project[];
  completedTodos$: Observable<Todo[]>;

  constructor(
    public authService: AuthService,
    private dataService: DataService,
    private appService: AppService,
    private ref: ChangeDetectorRef,
  ) {
  }

  ngOnInit() {
    this.appService.setTitle('Home');
    this.showCompleted = false;
    this.authService.currentUser$.pipe(take(1)).subscribe(userData => {
      if (userData) {
        this.initializePage('inbox');
      }
    });

    // subscribe to all projects and divide them to active and completed
    this.projectsSub = this.dataService.getAllProjects().pipe(
      tap(projects => {
        // convert firestore date type to readable format and
        // sort projects to active and completed
        this.allProjects = [];
        const activeProjects = [];
        const completedProjects = [];
        projects.forEach(project => {
            if (project.completed && project.completionDate) {
              project.completionDate = project.completionDate.toDate().toDateString();
              completedProjects.push(project);
            } else {
              activeProjects.push(project);
            }
          }
        );
        // if (completedProjects.length > 1) {
        //   completedProjects.sort((a, b) => b.completionDate.seconds - a.completionDate.seconds);
        // }
        this.completedProjects = completedProjects;
        this.activeProjects = activeProjects;
        this.allProjects = projects;
      }),
    ).subscribe();


  }

  ngOnDestroy(): void {
    this.projectsSub.unsubscribe();
  }

  initializePage(projectId: string) {
    this.appService.startLoading();
    this.currentProjectId = projectId;
    this.projectIds$ = this.dataService.getProjectIds();
    this.currentProject$ = this.dataService.getProject(projectId);
    if (projectId !== 'new') {
      this.todos$ = this.dataService.getTodos('project', '==', projectId);
      this.todoIds$ = this.dataService.getTodoIds(projectId);
    } else {
      this.todos$ = this.todoIds$ = of([]);
    }
    this.ref.markForCheck();
  }

  initializeCompleted() {
    this.appService.startLoading();
    // this.completedProjects$ = this.dataService.getProjects('completed', '==', true);
    this.projectIds$ = this.dataService.getProjectIds();
    this.completedTodos$ = this.dataService.getTodos('completed', '==', true)
      .pipe(
        tap(todos => {
          todos.forEach(todo =>
            todo.completionDate = todo.completionDate.toDate().toDateString()
          );
          this.appService.stopLoading();
        })
      );
  }

  onSetFilter(projectId: string) {
    // console.log('setting filter', projectId);
    if (projectId !== 'completed') {
      this.showCompleted = false;
      this.initializePage(projectId);
    } else {
      this.showCompleted = true;
      this.currentProjectId = projectId; // mark active style on filters component
      this.initializeCompleted();
    }
  }

  // handling TodoItems
  changeTodoStatus({id, completed}) {
    this.dataService.updateTodo(id, {completed})
      .then(() => console.log('db: todo updated'));
  }


  onAddTodo(todo: Todo) {
    todo.project = this.currentProjectId;
    this.dataService.createTodo(todo, this.currentProjectId)
      .then(() => console.log('db: todo item created'));
  }

  onEditTodo(todo: Todo) {
    this.dataService.updateTodo(todo.id, todo)
      .then(() => console.log('db: todo updated'));
    if (todo.project !== this.currentProjectId) {
      this.dataService.moveTodo(todo.id, this.currentProjectId, todo.project)
        .then(() => console.log('db: todoId moved'));
    }
  }

  onDeleteTodo(id: string) {
    this.dataService.deleteTodo(id, this.currentProjectId)
      .then(() => console.log('db: todo deleted'));
  }

  onReorderTodos(todoIds: string[]) {
    this.dataService.updateTodoIds(this.currentProjectId, todoIds)
      .then(() => console.log('db: todoIds updated for', this.currentProjectId));
  }

  // handling active Projects
  onUpdateProjectInfo(project: Project) {
    if (project.id === 'new') {
      this.dataService.addProject(project)
        .then(projectId => this.initializePage(projectId));
    } else {
      this.dataService.updateProject(project)
        .then(() => this.appService.stopLoading());
      if (project.completed) {
        this.onSetFilter('inbox');
      }
    }
  }

  onDeleteProject() {
    this.dataService.deleteProject(this.currentProjectId);
    this.initializePage('inbox');
  }

  onAddProject() {
    this.currentProject$ = of({id: 'new', title: '', completed: false, notes: ''});
    this.onSetFilter('new');
  }

  reorderProjects(activeIds: string[]) {
    let reorderedIds = [];
    this.dataService.getProjectIds().pipe(take(1)).subscribe(ids => {
      reorderedIds = ids.filter(id => !activeIds.includes(id));
      reorderedIds = [...activeIds, ...reorderedIds];
      this.dataService.updateProjectIds(reorderedIds)
        .then(() => console.log('db: projects re-ordered'));
    });
  }

}
