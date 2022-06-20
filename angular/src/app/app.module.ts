import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { CheckboxModule } from 'primeng/checkbox';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { MysqlComponent } from './mysql/mysql.component';
import { MongodbComponent } from './mongodb/mongodb.component';
import { SplitButtonModule } from 'primeng/splitbutton';
import { MysqlReportComponent } from './mysql-report/mysql-report.component';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { ToastModule } from 'primeng/toast';
import { MongodbReportComponent } from './mongodb-report/mongodb-report.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    MysqlComponent,
    MongodbComponent,
    MysqlReportComponent,
    MongodbReportComponent
  ],
  imports: [
    BrowserModule,
    DynamicDialogModule,
    HttpClientModule,
    BrowserAnimationsModule,
    CheckboxModule,
    TableModule,
    ButtonModule,
    SplitButtonModule,
    ToastModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
