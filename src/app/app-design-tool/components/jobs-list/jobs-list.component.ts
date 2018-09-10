import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-jobs-list',
  templateUrl: './jobs-list.component.html',
  styleUrls: ['./jobs-list.component.scss'],
})
export class JobsListComponent implements OnInit {
  public jobs: string[] = ['job1', 'job2', 'job3'];
  constructor() { }

  ngOnInit(): void {
  }

}
