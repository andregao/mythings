import { Component, EventEmitter, Input, OnChanges, OnInit, Output, QueryList, SimpleChanges, ViewChildren } from '@angular/core';
import { Project } from '../../../shared/models/project.model';
import { Todo } from '../../../shared/models/todo.model';
import { MatCheckboxChange, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

@Component({
  selector: 'mt-completed',
  templateUrl: './completed.component.html',
  styleUrls: ['./completed.component.scss']
})
export class CompletedComponent implements OnInit, OnChanges {
  // projects
  @Input() completedProjects: Project[];
  @Input() allProjects: Project[];
  @Input() projectIds: string[];
  @Output() setFilter = new EventEmitter<string>();
  projectMap: {[projectId: string]: string};
  projectTableData: MatTableDataSource<Project>;
  projectTableColumns = ['title', 'completionDate'];

  // todoItems
  @Input() completedTodos: Todo[];
  @Output() changeTodoStatus = new EventEmitter();
  todoTableData: MatTableDataSource<Todo>;
  todoTableColumns = ['completed', 'title', 'project', 'completionDate'];

  @ViewChildren(MatPaginator) paginator: QueryList<MatPaginator>;
  @ViewChildren(MatSort) sort: QueryList<MatSort>;

  constructor() {
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('Completed Component', changes);

    // update todoItems table when data changes
    if (changes.completedTodos && changes.completedTodos.currentValue) {
      this.updateTodosTable();
    }

    // update project table when data changes
    if (changes.completedProjects && changes.completedProjects.currentValue) {
      this.updateProjectsTable();
    }

    // update project map when all projects change
    if (changes.allProjects && changes.allProjects.currentValue) {
      this.updateProjectsMap();
    }
  }

  updateTodosTable() {
    this.todoTableData = new MatTableDataSource<Todo>(this.completedTodos);
    // customize filter logic
    this.todoTableData.filterPredicate = this.todoFilter(this.projectMap);
    // customize sorting logic
    this.todoTableData.sortingDataAccessor = this.sortIncludeDate;
    // assign paginator and sorter asynchronously
    setTimeout(() => {
      this.todoTableData.paginator = this.paginator.first;
      this.todoTableData.sort = this.sort.first;
    });
  }

  updateProjectsTable() {
    // console.log('projects data changed');
    this.projectTableData = new MatTableDataSource<Project>(this.completedProjects);
    // customize sorting logic
    this.projectTableData.sortingDataAccessor = this.sortIncludeDate;
    setTimeout(() => {
      this.projectTableData.paginator = this.paginator.last;
      this.projectTableData.sort = this.sort.last;
    });
  }

  updateProjectsMap() {
    const newProjectMap = {};
    this.allProjects.forEach(project => {
      newProjectMap[project.id] = project.title;
    });
    this.projectMap = {...newProjectMap};
    // recreate todoTable
    this.updateTodosTable();
  }

  // transform date to integer to sort
  private sortIncludeDate(data, sortHeaderId) {
    if (sortHeaderId === 'completionDate') {
      const date = new Date(data[sortHeaderId]);
      return date.getTime();
    } else {
      return data[sortHeaderId];
    }
  }

  // enable todoItem  filter to search for project title
  todoFilter(projectMap) {
    return (data, keyword) => {
      keyword = keyword.trim().toLowerCase();
      return data.title.toLowerCase().includes(keyword) ||
        projectMap[data.project].toLowerCase().includes(keyword) ||
        data.completionDate.toLowerCase().includes(keyword);
    };
  }

  // todoItems
  searchTodoTable(keyword: string) {
    this.todoTableData.filter = keyword;
  }

  onTodoCheckboxChange(id: string, change: MatCheckboxChange) {
    this.changeTodoStatus.emit({id, completed: change.checked});
  }

  // projects
  searchProjectTable(keyword: string) {
    this.projectTableData.filter = keyword.trim().toLowerCase();
  }

  onSetFilter(projectId: string) {
    this.setFilter.emit(projectId);
  }


}
