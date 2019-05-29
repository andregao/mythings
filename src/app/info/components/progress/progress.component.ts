import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'mt-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.scss']
})
export class ProgressComponent implements OnInit {

  private _now: Date = new Date();
  set now(now: Date) {
    this._now = now;
    this.dayLeft = 1 - now.getHours() / 24;
    this.weekLeft = 1 - now.getDay() / 7;
    this.yearLeft = 1 - this.daysPassed(now) / 365;
    if (this.age) {
      const lifeLeft = 1 - this.age / 79;
      this.lifeLeft = lifeLeft > 0 ? lifeLeft : 0.01;
    }
  }

  get now() {
    return this._now;
  }

  dayLeft: number;
  weekLeft: number;
  yearLeft: number;

  age: number;
  lifeLeft: number;

  ageForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.ageForm = fb.group({
      age: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.setNow();
    // setInterval(this.setNow, 30000);
  }

  daysPassed(now: Date) {
    const beginning = new Date(`${now.getFullYear()}-1-1`);
    return (+now - +beginning) / 1000 / 60 / 60 / 24;
  }

  setNow() {
    this.now = new Date();
  }

  onSubmitAge() {
    this.age = this.ageForm.value.age;
    this.setNow();
  }

}
