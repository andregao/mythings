import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Project } from '../../../shared/models/project.model';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'mt-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss']
})
export class FiltersComponent implements OnInit, OnChanges {
  orderedProjects: Project[] = [];
  @Input() activeProjects: Project[];
  @Input() projectIds: string[];
  @Input() currentFilter: string;

  @Output() setFilter = new EventEmitter<string>();
  @Output() addProject = new EventEmitter<void>();
  @Output() reorderProjects = new EventEmitter<string[]>();
  @Output() showCompleted = new EventEmitter<void>();


  constructor() {
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    // console.log('Filters component', changes);
    if (changes.projects && changes.projects.currentValue && !changes.projects.currentValue.length) {
      // console.log('no active projects in filters');
      this.orderedProjects = [];
    }
    if (this.projectIds && this.projectIds.length && this.activeProjects && this.activeProjects.length) {
      this.sortProjects();
    }
  }

  sortProjects() {
    // console.log('sorting projects');
    const orderedProjects = [];
    this.projectIds.forEach(id => {
      const project = this.activeProjects.find(p => p.id === id);
      if (project) {
        orderedProjects.push(project);
      }
    });
    this.orderedProjects = orderedProjects;
  }

  onSetFilter(filter: string) {
    this.setFilter.emit(filter);
  }

  onAddProject() {
    this.addProject.emit();
  }

  onProjectDrop(event: CdkDragDrop<Project[]>) {
    if (this.orderedProjects.length > 1 && (event.previousIndex !== event.currentIndex)) {
      moveItemInArray(this.orderedProjects, event.previousIndex, event.currentIndex);
      let reorderedProjectIds: string[] = [];
      this.orderedProjects.forEach(
        p => reorderedProjectIds = [...reorderedProjectIds, p.id]
      );
      this.reorderProjects.emit(reorderedProjectIds);
    }
  }
}
