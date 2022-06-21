import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { DatabaseService } from '../database.service';
import { DialogService } from 'primeng/dynamicdialog';
import { MysqlComponent } from '../mysql/mysql.component';
import { MysqlReportComponent } from '../mysql-report/mysql-report.component';
import { MessageService } from 'primeng/api';
import { MongodbReportComponent } from '../mongodb-report/mongodb-report.component';

@Component({
  selector: 'app-header',
  providers: [DialogService, MessageService],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  items: MenuItem[] = [];
  database: string = "";

  @Output() databaseEvent = new EventEmitter<string>();

  constructor(private databaseService: DatabaseService,
              private dialogService: DialogService,
              private messageService: MessageService) { }

  ngOnInit(): void {
    this.items = [
      {
        label: 'MySQL',
        command: () => {
          this.database = "mysql"
          this.messageService.add({severity:'success', summary:'Database Service Message', detail:'Switched to MySQL database'});
          this.databaseEvent.emit(this.database);
        }
      },
      {
        label: 'MongoDB',
        command: () => {
          this.database = "mongodb"
          this.messageService.add({severity:'success', summary:'Database Service Message', detail:'Switched to MongoDB database'});
          this.databaseEvent.emit(this.database);
        }
      }
    ];
  }

  fillMyDatabase(): void {
    switch(this.database) {
      case "mysql": {
        this.databaseService.fillMySqlDatabase();
        break;
      }
      case "mongodb": {
        this.databaseService.fillMongoDbDatabase();
        break;
      }
      default:
        this.messageService.add({severity:'warn', summary:'Database Service Message', detail:'Please choose a database'});
    }
  }

  migrateMyDatabase(): void {
    this.databaseService.migrateMySqlDatabase();
  }

  openReport(): void {
    switch(this.database) {
      case "mysql": {
        this.dialogService.open(MysqlReportComponent, {
          header: "Report",
          width: "80%"
        });
        break;
      }
      case "mongodb": {
        this.dialogService.open(MongodbReportComponent, {
          header: "Report",
          width: "80%"
        })
        break;
      }
    }
    
  }

  unsetDb(): void {
    this.database = 'No DB';
    this.databaseEvent.emit(this.database);
    this.messageService.add({severity:'success', summary:'Database Service Message', detail:'Database was unset'});
  }
}
