import { MTItem } from './mt-item.model';

export interface Checklist extends MTItem {
  todo?: string; // which TodoItem does this checklist item belong to
  ids?: string[]; // specifies order for the checklist items
  entities?: {
    [key: string]: ChecklistItem,
  };
}

interface ChecklistItem {
  title: string;
  completed: boolean;
}
