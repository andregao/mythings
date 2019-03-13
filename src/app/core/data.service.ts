import { environment } from '../../environments/environment';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { firestore } from 'firebase/app';
import WhereFilterOp = firebase.firestore.WhereFilterOp;
import { map, take, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { UserDoc } from '../shared/models/user-doc.model';
import { Todo } from '../shared/models/todo.model';
import { Project } from '../shared/models/project.model';
import { Heading } from '../shared/models/heading.model';
import { Checklist } from '../shared/models/checklist.model';
import { AppService } from './app.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private dbEnv: string = environment.dbEnvironment;
  private userDoc: AngularFirestoreDocument<UserDoc>;
  private usersCol: AngularFirestoreCollection<UserDoc>;
  private todosCol: AngularFirestoreCollection<Todo>;
  private projectsCol: AngularFirestoreCollection<Project>;
  private headingsCol: AngularFirestoreCollection<Heading>;
  private checklistsCol: AngularFirestoreCollection<Checklist>;

  constructor(
    private afs: AngularFirestore,
    private appService: AppService,
  ) {
    // set database environment to dev or prod
    this.usersCol = afs.collection(this.dbEnv);
  }

  // work with Auth on user data
  setCurrentUser(user) {
    this.setCurrentUserDoc(user.uid);
    return this.getUserData();
  }

  setCurrentUserDoc(id: string): void {
    this.userDoc = this.usersCol.doc(id);
    this.todosCol = this.userDoc.collection('todos');
    this.projectsCol = this.userDoc.collection('projects');
    this.headingsCol = this.userDoc.collection('headings');
    this.checklistsCol = this.userDoc.collection('checklists');
  }

  async getUserData(): Promise<UserDoc> {
    const doc = await this.userDoc.ref.get();
    if (doc.exists) {
      const data = doc.data();
      return data as UserDoc;
    } else {
      console.log('no user data');
      return null;
    }
  }

  // updates db user data depending on whether it's a new user
  async updateUserDoc(userData) {
    // console.log('updating user document', userData);
    this.setCurrentUserDoc(userData.uid);
    const userDocData = {
      id: userData.uid,
      email: userData.email,
      displayName: userData.displayName,
      photoURL: userData.photoURL,
    };
    const userDocRef = await this.userDoc.ref.get();
    if (userDocRef.exists) {
      // console.log('return user signed in');
      return await this.userDoc.update(userDocData);
    } else {
      // console.log('new user signed in');
      return await this.initializeNewUser(userDocData);
    }
  }

  initializeNewUser(data: UserDoc) {
    data.projectIds = [];
    data.signUpDate = firestore.FieldValue.serverTimestamp();
    // console.log('initializing data', data);
    const batch = this.afs.firestore.batch();
    batch.set(this.userDoc.ref, data);
    batch.set(this.projectsCol.doc('inbox').ref, {id: 'inbox', title: 'Inbox', todoIds: []});
    batch.set(this.projectsCol.doc('someday').ref, {id: 'someday', title: 'Someday', todoIds: []});
    return batch.commit();
  }

  // Static content
  getWelcomeContent() {
    return this.afs.doc('static/welcome').ref.get();
  }

  // TodoItems CRUD
  getTodos(field: string, opStr: WhereFilterOp, value: any): Observable<Todo[]> {
    return this.userDoc.collection<Todo>(
      'todos',
      ref => ref.where(field, opStr, value)
    ).valueChanges();
  }

  getAllTodos() {
    return this.todosCol.valueChanges().pipe(tap(todos => {
      if (todos) {
        console.log('got all todos', todos);
        // this.appService.stopLoading();
      }
    }));
  }

  getTodoIds(projectId: string): Observable<string[]> {
    return this.projectsCol.doc<Project>(projectId).valueChanges().pipe(
      map(p => p.todoIds),
      tap(todoIds => {
        if (!todoIds || !todoIds.length) {
          // this.appService.stopLoading();
        }
      }),
    );
  }

  createTodo(todo: Todo, projectId: string): Promise<void> {
    const todoId = this.afs.createId();
    todo.id = todoId;
    todo.creationDate = firestore.FieldValue.serverTimestamp();
    // console.log('new todo id generated', todoId);

    const batch = this.afs.firestore.batch();
    batch.set(this.todosCol.doc(todoId).ref, todo);
    batch.update(this.projectsCol.doc(projectId).ref,
      {todoIds: firestore.FieldValue.arrayUnion(todoId)}
    );
    return batch.commit();
  }

  updateTodo(id: string, todo: Todo): Promise<void> {
    if (todo.completed) {
      todo.completionDate = firestore.FieldValue.serverTimestamp();
    }
    return this.todosCol.doc(id).update(todo);
  }

  updateTodoIds(projectId: string, todoIds: string[]): Promise<void> {
    return this.projectsCol.doc(projectId).update({todoIds});
  }

  moveTodo(todoId: string, fromProject: string, toProject: string): Promise<void> {
    const batch = this.afs.firestore.batch();
    batch.update(this.projectsCol.doc(toProject).ref,
      {todoIds: firestore.FieldValue.arrayUnion(todoId)}
    );
    batch.update(this.projectsCol.doc(fromProject).ref,
      {todoIds: firestore.FieldValue.arrayRemove(todoId)}
    );
    return batch.commit();
  }

  deleteTodo(todoId: string, projectId: string): Promise<void> {
    const batch = this.afs.firestore.batch();
    batch.update(this.projectsCol.doc(projectId).ref,
      {todoIds: firestore.FieldValue.arrayRemove(todoId)}
    );
    batch.delete(this.todosCol.doc(todoId).ref);
    return batch.commit();
  }

  // Projects CRUD
  getProject(id: string) {
    if (id === 'new') {
      this.appService.stopLoading();
      return of({id: 'new', title: '', completed: false, notes: ''});
    }
    return this.projectsCol.doc(id).valueChanges();
  }

  getAllProjects(): Observable<Project[]> {
    return this.projectsCol.valueChanges().pipe(tap(data => {
      if (data) {
        // console.log('got all projects', data);
      }
    }));
  }

  getProjectIds() {
    return this.userDoc.valueChanges().pipe(map(user => user.projectIds));
  }

  updateProjectIds(projectIds: string[]) {
    return this.userDoc.update({projectIds});
  }

  updateProject(project: Project): Promise<void> {
    if (project.completed) {
      project.completionDate = firestore.FieldValue.serverTimestamp();
    }
    return this.projectsCol.doc(project.id).update(project);
  }

  addProject(project: Project): Promise<string> {
    this.appService.startLoading();
    const projectId = this.afs.createId();
    project.id = projectId;
    project.creationDate = firestore.FieldValue.serverTimestamp();
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
