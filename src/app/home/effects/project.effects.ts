import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { ProjectActions, StatusActions } from '../actions';
import { DataService } from '../../core/data.service';
import { exhaustMap, map, tap } from 'rxjs/operators';
import { Project } from '../../shared/models/project.model';
import { from } from 'rxjs';

@Injectable()
export class ProjectEffects {
  constructor(
    private actions$: Actions<ProjectActions.ProjectActionsUnion>,
    private dataService: DataService,
  ) {
  }

  @Effect()
  addProject$ = this.actions$.pipe(
    ofType(ProjectActions.ProjectActionTypes.AddProject),
    map((action: ProjectActions.AddProject) => action.payload),
    exhaustMap((project: Project) => from(this.dataService.createProject(project))),
    map(projectId => new StatusActions.SetCurrentProject(projectId)),
  );

  @Effect({dispatch: false})
  updateProject$ = this.actions$.pipe(
    ofType(ProjectActions.ProjectActionTypes.UpdateProject),
    map((action: ProjectActions.UpdateProject) => action.payload),
    tap((project: Project) => this.dataService.updateProject(project)),
  );

  @Effect({dispatch: false})
  deleteProject$ = this.actions$.pipe(
    ofType(ProjectActions.ProjectActionTypes.DeleteProject),
    map((action: ProjectActions.DeleteProject) => action.payload),
    tap((id: string) => this.dataService.deleteProject(id)),
  );

  @Effect({dispatch: false})
  reorderProjects$ = this.actions$.pipe(
    ofType(ProjectActions.ProjectActionTypes.ReorderProjects),
    map((action: ProjectActions.ReorderProjects) => action.payload),
    tap((ids: string[]) => this.dataService.updateProjectIds(ids)),
  );
}
