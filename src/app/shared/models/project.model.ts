import { MTItem } from './mt-item.model';

export interface Project extends MTItem {
  notes?: string;
  when?: number;
  deadline?: number;
  todoIds?: string[]; // to keep order of top level todoItems
}
