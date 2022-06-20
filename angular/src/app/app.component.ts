import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'app';
  database: string = 'No DB';

  constructor() { }

  setDatabase(database: string) {
    this.database = database;
  }
  
}
