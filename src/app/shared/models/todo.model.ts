import { MTItem } from './mt-item.model';

export interface Todo extends MTItem {
  project?: string;
  notes?: string;
  when?: number;
  deadline?: number;
  checklistIds?: string[]; // used to track the order of its checklists
}
