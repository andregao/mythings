import { MTItem } from './mt-item.model';

export interface Heading extends MTItem {
  project?: string; // to which project this heading belongs
  todoIds?: string[]; // to keep the order of todoItems under this heading
}
