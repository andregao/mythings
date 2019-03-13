import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  private isLoading = new BehaviorSubject<boolean>(true);
  isLoading$ = this.isLoading.asObservable();

  private loadingType = new BehaviorSubject<string>('indeterminate');
  loadingType$ = this.loadingType.asObservable();

  constructor(private titleService: Title) {
  }

  startLoading(type: string = 'indeterminate') {
    // console.log('loader starts');
    this.loadingType.next(type);
    this.isLoading.next(true);
  }

  stopLoading() {
    // console.log('loading ends');
    this.isLoading.next(false);
  }

  setTitle(title: string) {
    this.titleService.setTitle(title);
  }
}
