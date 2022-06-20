import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DatabaseService } from '../database.service';

@Component({
  selector: 'app-mongodb',
  providers: [MessageService],
  templateUrl: './mongodb.component.html',
  styleUrls: ['./mongodb.component.css']
})
export class MongodbComponent implements OnInit {
  intern = [];

  constructor(private databaseService: DatabaseService,
              private messageService: MessageService) { }

  ngOnInit(): void {
    this.getMongoDbInterns();
  }

  promoteMongoDbIntern(employee_id: number): void {
    this.databaseService.promoteMongoDbIntern(employee_id).subscribe();
    this.messageService.add({severity:'success', summary:'Database Service Message', detail: `${employee_id} was succesfully promoted!`});
    setTimeout(() => {this.getMongoDbInterns()}, 100);
  }

  getMongoDbInterns(): void {
    this.databaseService.getMongoDbInterns().subscribe((data) => this.intern = data);
  }
}
