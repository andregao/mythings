import { Project } from '../../shared/models/project.model';
import { Action } from '@ngrx/store';

export enum ProjectActionTypes {
  SyncProjects = '[Home] Sync Projects',
  AddProject = '[Home] Add Project',
  UpdateProject = '[Home] Update Project',
  DeleteProject = '[Home] Delete Project',
  ReorderProjects = '[Home] Reorder Projects',
  ClearProjects = '[Home] Clear Projects',
}

export class SyncProjects implements Action {
  readonly type = ProjectActionTypes.SyncProjects;

  constructor(public payload: Project[]) {
  }
}

export class AddProject implements Action {
  readonly type = ProjectActionTypes.AddProject;

  constructor(public payload: Project) {
  }
}

export class UpdateProject implements Action {
  readonly type = ProjectActionTypes.UpdateProject;

  constructor(public payload: Project) {
  }
}

export class DeleteProject implements Action {
  readonly type = ProjectActionTypes.DeleteProject;

  constructor(public payload: string) {
  }
}

export class ReorderProjects implements Action {
  readonly type = ProjectActionTypes.ReorderProjects;

  constructor(public payload: string[]) {
  }
}

export class ClearProjects implements Action {
  readonly type = ProjectActionTypes.ClearProjects;
}

export type ProjectActionsUnion =
  | SyncProjects
  | AddProject
  | UpdateProject
  | DeleteProject
  | ReorderProjects
  | ClearProjects;
