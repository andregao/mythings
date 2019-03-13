import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'mt-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent implements OnInit {
  @Input() mode: 'query' | 'indeterminate';
  @Input() show: boolean;

  constructor() {
  }

  ngOnInit() {
  }

}
