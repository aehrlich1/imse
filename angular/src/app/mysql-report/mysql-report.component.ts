import { Component, OnInit } from '@angular/core';
import { Report } from '../config/Report';
import { DatabaseService } from '../database.service';

@Component({
  selector: 'app-mysql-report',
  templateUrl: './mysql-report.component.html',
  styleUrls: ['./mysql-report.component.css']
})
export class MysqlReportComponent implements OnInit {
  report: Report[] = [];

  constructor(private databaseService: DatabaseService) { }

  ngOnInit(): void {
    this.databaseService.getMySqlReport().subscribe((data) => this.report = data[4])
  }

}
