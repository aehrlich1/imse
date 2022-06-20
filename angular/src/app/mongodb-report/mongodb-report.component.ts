import { Component, OnInit } from '@angular/core';
import { Report } from '../config/Report';
import { DatabaseService } from '../database.service';

@Component({
  selector: 'app-mongodb-report',
  templateUrl: './mongodb-report.component.html',
  styleUrls: ['./mongodb-report.component.css']
})
export class MongodbReportComponent implements OnInit {
  report: Report[] = [];

  constructor(private databaseService: DatabaseService) { }

  ngOnInit(): void {
    this.databaseService.getMongdoDbReport().subscribe((data) => this.report = data)
  }
}
