import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs';
import { Employee } from '../config/Employee';
import { DatabaseService } from '../database.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-mysql',
  providers: [MessageService],
  templateUrl: './mysql.component.html',
  styleUrls: ['./mysql.component.css']
})
export class MysqlComponent implements OnInit {
  interns: Employee[] = [];

  constructor(private databaseService: DatabaseService,
              private messageService: MessageService) { }

  ngOnInit(): void {
    this.getMySqlInterns();
  }

  promoteIntern(employee_id: number): void {
    this.databaseService.promoteIntern(employee_id).subscribe();
    this.messageService.add({severity:'success', summary:'Database Service Message', detail: `${employee_id} was succesfully promoted!`});
    setTimeout(() => {this.getMySqlInterns()}, 100);    
  }

  getMySqlInterns(): void {
    this.databaseService.getMySqlInterns().subscribe((data) => this.interns = data);
  }
}
