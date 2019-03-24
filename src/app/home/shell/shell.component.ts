import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { combineLatest, merge, of, Subscription } from 'rxjs';
import { Todo } from '../../shared/models/todo.model';
import { Project } from '../../shared/models/project.model';
import { map, skip, take, tap, withLatestFrom } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';
import * as fromHome from '../../home/reducers';
import * as fromAuth from '../../auth/reducers';
import * as fromRoot from '../../core/reducers';
import { LayoutActions } from '../../core/actions';
import { DataActions, ProjectActions, StatusActions, TodoActions } from '../actions';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';


@Component({
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShellComponent implements OnInit, OnDestroy {
  dataStatusSub: Subscription;

  // layout
  drawerMode$ = this.breakpointObserver.observe(Breakpoints.HandsetPortrait)
    .pipe(
      map(result => result.matches),
      tap(isHandset => this.store.dispatch(new LayoutActions.SetDrawerOpened(!isHandset))),
      map(isHandset => isHandset ? 'over' : 'side'),
      tap(mode => this.store.dispatch(new LayoutActions.SetDrawerMode(mode))),
    );
  isDrawerOpened$ = this.store.pipe(select(fromRoot.shouldDrawerOpen));

  // whether to show the completed component
  showCompleted$ = this.store.pipe(
    select(fromHome.currentProjectId),
    map(id => id === 'completed'),
  );

  // used in filters child component
  currentProjectId$ = this.store.pipe(select(fromHome.currentProjectId));
  activeProjects$ = this.store.pipe(select(fromHome.activeProjects));
  projectIds$ = this.store.pipe(select(fromAuth.getProjectIds));

  // used in lists child component
  currentProject$ = this.store.pipe(select(fromHome.currentProject));
  todos$ = this.store.pipe(select(fromHome.allTodos));
  todoIds$ = this.store.pipe(select(fromHome.todoIds));

  // used in completed child component
  allProjects$ = this.store.pipe(select(fromHome.allProjects));
  completedProjects$ = this.store.pipe(select(fromHome.completedProjects));
  completedTodos$ = this.store.pipe(select(fromHome.completedTodos));

  constructor(
    private breakpointObserver: BreakpointObserver,
    private store: Store<fromRoot.State>,
  ) {
    this.store.dispatch(new LayoutActions.SetTitle('Home - mathangs.com'));
  }

  ngOnInit() {
    this.dataStatusSub = this.store.pipe(
      select(fromHome.needData),
    ).subscribe(needData => {
      if (needData) {
        this.store.dispatch(new DataActions.StartSyncingData());
        this.checkInitialSync();
      }
    });
  }

  ngOnDestroy(): void {
    this.dataStatusSub.unsubscribe();
  }

  checkInitialSync() {
    combineLatest(
      this.store.pipe(select(fromHome.allProjects), skip(1)),
      this.store.pipe(select(fromHome.allTodos), skip(1)),
      this.store.pipe(select(fromAuth.getProjectIds), skip(1)),
    ).pipe(take(1))
      .subscribe(() => {
        this.store.dispatch(new DataActions.InitialSyncSuccess());
        this.store.dispatch(new StatusActions.SetNeedData(false));
      });
  }

  onSetFilter(projectId: string) {
    this.store.dispatch(new LayoutActions.SetDrawerOpened(false));
    this.store.dispatch(new StatusActions.SetCurrentProject(projectId));
  }

  closeDrawer() {
    this.store.dispatch(new LayoutActions.SetDrawerOpened(false));
  }

  /*
    Todos
  */
  onAddTodo(todoInput: Todo) {
    of(todoInput).pipe(
      withLatestFrom(this.store.pipe(select(fromHome.currentProjectId))),
      map(([todo, projectId]) => {
        todo.project = projectId;
        return todo;
      }),
      take(1),
    ).subscribe(todo => this.store.dispatch(new TodoActions.AddTodo(todo)));
  }

  toggleTodoStatus(todo) {
    this.store.dispatch(new TodoActions.ToggleTodoStatus(todo));
  }

  onEditTodo({todo, fromProject}) {
    this.store.dispatch(new TodoActions.UpdateTodo(todo));
    if (todo.project !== fromProject) {
      this.store.dispatch(new TodoActions.MoveTodo({todo, fromProject}));
    }
  }

  onDeleteTodo(todo: Todo) {
    this.store.dispatch(new TodoActions.DeleteTodo(todo));
  }

  onReorderTodos({todoIds, projectId}) {
    this.store.dispatch(new TodoActions.ReorderTodos({todoIds, projectId}));
  }

  /*
  Projects
 */
  onUpdateProject(project: Project) {
    if (project.id === 'new') {
      this.store.dispatch(new ProjectActions.AddProject(project));
    } else {
      this.store.dispatch(new ProjectActions.UpdateProject(project));
      if (project.completed) {
        this.store.dispatch(new StatusActions.SetCurrentProject('inbox'));
      }
    }
  }

  onDeleteProject(id: string) {
    this.store.dispatch(new ProjectActions.DeleteProject(id));
    this.store.dispatch(new StatusActions.SetCurrentProject('inbox'));
  }

  onAddProject() {
    this.store.dispatch(new LayoutActions.SetDrawerOpened(false));
    this.store.dispatch(new StatusActions.SetCurrentProject('new'));
  }

  reorderProjects(activeProjectIds: string[]) {
    let newProjectIds = [];
    this.store.pipe(
      select(fromAuth.getProjectIds),
      take(1),
    ).subscribe(ids => {
      // find completed project ids first
      newProjectIds = ids.filter(id => !activeProjectIds.includes(id));
      // put active project ids in front
      newProjectIds = [...activeProjectIds, ...newProjectIds];
      this.store.dispatch(new ProjectActions.ReorderProjects(newProjectIds));
    });
  }

}
