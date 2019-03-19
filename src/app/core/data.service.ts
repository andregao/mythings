import { environment } from '../../environments/environment';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { firestore } from 'firebase/app';
import { take } from 'rxjs/operators';
import { from, Observable, Subscription } from 'rxjs';
import { Injectable, OnDestroy } from '@angular/core';
import { UserDoc } from '../shared/models/user.model';
import { Todo } from '../shared/models/todo.model';
import { Project } from '../shared/models/project.model';
import { Heading } from '../shared/models/heading.model';
import { Checklist } from '../shared/models/checklist.model';
import { Store } from '@ngrx/store';
import { State } from './reducers';
import { AuthActions } from '../auth/actions';
import { ProjectActions, TodoActions } from '../home/actions';
import WhereFilterOp = firebase.firestore.WhereFilterOp;

@Injectable({
  providedIn: 'root'
})
export class DataService implements OnDestroy {
  private dbEnv: string = environment.dbEnvironment;
  private userDoc: AngularFirestoreDocument<UserDoc>;
  private usersCol: AngularFirestoreCollection<UserDoc> = this.afs.collection(this.dbEnv);
  private todosCol: AngularFirestoreCollection<Todo>;
  private projectsCol: AngularFirestoreCollection<Project>;
  private headingsCol: AngularFirestoreCollection<Heading>;
  private checklistsCol: AngularFirestoreCollection<Checklist>;
  projectsSub: Subscription;
  todosSub: Subscription;
  projectIdsSub: Subscription;

  constructor(
    private afs: AngularFirestore,
    private store: Store<State>
  ) {
  }

  ngOnDestroy(): void {
    this.projectsSub.unsubscribe();
    this.todosSub.unsubscribe();
    this.projectIdsSub.unsubscribe();
  }

  startSyncingData(): void {
    this.projectsSub = this.getAllProjects()
      .subscribe(projects =>
        this.store.dispatch(new ProjectActions.SyncProjects(projects))
      );
    this.todosSub = this.getAllTodos()
      .subscribe(todos =>
        this.store.dispatch(new TodoActions.SyncTodos(todos))
      );
    this.projectIdsSub = this.getUserData()
      .subscribe(user => this.store.dispatch(new AuthActions.SyncProjectIds(user)));
  }

  stopSyncingData() {
    this.projectsSub.unsubscribe();
    this.todosSub.unsubscribe();
    this.projectIdsSub.unsubscribe();
  }

  /*
  Users CRUD
  */
  setCurrentUserDoc(id: string): void {
    this.userDoc = this.usersCol.doc(id);
    this.todosCol = this.userDoc.collection('todos');
    this.projectsCol = this.userDoc.collection('projects');
    this.headingsCol = this.userDoc.collection('headings');
    this.checklistsCol = this.userDoc.collection('checklists');
  }

  async getUserDataGoogle(user: UserDoc) {
    this.setCurrentUserDoc(user.id);
    const userDocRef = await this.userDoc.ref.get();
    if (userDocRef.exists) {
      // check if name or photo changed
      const {displayName, photoURL} = userDocRef.data() as UserDoc;
      if (user.displayName === displayName && user.photoURL === photoURL) {
        this.store.dispatch(new AuthActions.GetUserDataSuccess(userDocRef.data() as UserDoc));
      } else {
        this.store.dispatch(new AuthActions.UpdateUserData(user));
      }
    } else {
      this.store.dispatch(new AuthActions.InitializeNewUser(user));
    }
  }

  getUserData(id?: string): Observable<UserDoc> {
    if (id) {
      this.setCurrentUserDoc(id);
      return this.usersCol.doc<UserDoc>(id).valueChanges();
    } else {
      return this.userDoc.valueChanges();
    }
  }

  updateUserDoc(userData) {
    return this.userDoc.update(userData);
  }

  async initializeNewUser(user: UserDoc) {
    user.projectIds = [];
    user.signUpDate = this.getCurrentTime();
    this.setCurrentUserDoc(user.id);
    const batch = this.afs.firestore.batch();
    batch.set(this.userDoc.ref, user);
    batch.set(this.projectsCol.doc('inbox').ref, {id: 'inbox', title: 'Inbox', todoIds: []});
    batch.set(this.projectsCol.doc('someday').ref, {id: 'someday', title: 'Someday', todoIds: []});
    await batch.commit();
    // return user data after initialization
    const userData = await this.userDoc.ref.get();
    this.store.dispatch(new AuthActions.GetUserDataSuccess(userData.data() as UserDoc));
  }

  getWelcomeContent() {
    return this.afs.doc('static/welcome').valueChanges().pipe(
      take(1),
    );
  }

  private getCurrentTime() {
    const time = new Date();
    return `${time.toDateString()} ${time.toLocaleTimeString()}`;
  }

  /*
  Todos CRUD
  */
  getAllTodos() {
    return this.todosCol.valueChanges();
  }

  createTodo(todo: Todo): Observable<void> {
    const todoId = this.afs.createId();
    todo.id = todoId;
    todo.creationDate = this.getCurrentTime();

    const batch = this.afs.firestore.batch();
    batch.set(this.todosCol.doc(todoId).ref, todo);
    batch.update(this.projectsCol.doc(todo.project).ref,
      {todoIds: firestore.FieldValue.arrayUnion(todoId)}
    );
    return from(batch.commit());
  }

  updateTodo(todo: Todo): Promise<void> {
    if (todo.completed) {
      todo.completionDate = this.getCurrentTime();
    }
    return this.todosCol.doc(todo.id).update(todo);
  }

  updateTodoIds({todoIds, projectId}): Promise<void> {
    return this.projectsCol.doc(projectId).update({todoIds});
  }

  moveTodo({todo, fromProject: fromProject}): Promise<void> {
    const batch = this.afs.firestore.batch();
    batch.update(this.projectsCol.doc(todo.project).ref,
      {todoIds: firestore.FieldValue.arrayUnion(todo.id)}
    );
    batch.update(this.projectsCol.doc(fromProject).ref,
      {todoIds: firestore.FieldValue.arrayRemove(todo.id)}
    );
    return batch.commit();
  }

  deleteTodo({id, project}: Todo): Promise<void> {
    const batch = this.afs.firestore.batch();
    batch.update(this.projectsCol.doc(project).ref,
      {todoIds: firestore.FieldValue.arrayRemove(id)}
    );
    batch.delete(this.todosCol.doc(id).ref);
    return batch.commit();
  }

  /*
  Projects CRUD
  */
  getAllProjects(): Observable<Project[]> {
    return this.projectsCol.valueChanges();
  }

  updateProjectIds(projectIds: string[]) {
    return this.userDoc.update({projectIds});
  }

  updateProject(project: Project): Promise<void> {
    if (project.completed) {
      project.completionDate = this.getCurrentTime();
    }
    return this.projectsCol.doc(project.id).update(project);
  }

  createProject(project: Project): Promise<string> {
    const projectId = this.afs.createId();
    project.id = projectId;
    project.creationDate = this.getCurrentTime();
    // create a batch to add project AND update user's projectIds array
    const batch = this.afs.firestore.batch();
    batch.set(this.projectsCol.doc(projectId).ref, project);
    batch.update(this.userDoc.ref, {projectIds: firestore.FieldValue.arrayUnion(projectId)});
    return batch.commit().then(() => projectId);
  }

  deleteProject(projectId: string) {
    // console.log('data service delete project start');
    const batch = this.afs.firestore.batch();
    const todoRefs = this.userDoc.collection('todos', ref => ref.where('project', '==', projectId));
    todoRefs.get().pipe(take(1)).subscribe(docs => {
      docs.forEach(v => batch.delete(v.ref));
      batch.delete(this.projectsCol.doc(projectId).ref);
      batch.update(this.userDoc.ref, {projectIds: firestore.FieldValue.arrayRemove(projectId)});
      batch.commit().then(() => console.log('db: deleted project from firestore'));
    });

  }

  // headings
  getHeadings(field: string, opStr: WhereFilterOp, value: any) {
    return this.userDoc.collection('headings', ref => ref.where(field, opStr, value));
  }

  // checklists
  getChecklist(field: string, opStr: WhereFilterOp, value: any) {
    return this.userDoc.collection('checklists', ref => ref.where(field, opStr, value));
  }


}
