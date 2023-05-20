import { Component, OnInit } from '@angular/core';
import { EmployeeWorkTimeService } from '../services/employee-work-time.service';
import { WorkEntry } from '../model/work-entry';
import { Employee } from '../model/employee';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css'],
})
export class DataTableComponent implements OnInit {
  constructor(private workTimeService: EmployeeWorkTimeService) {}

  workEntries: WorkEntry[] = [];
  employees: Employee[] = [];
  ngOnInit(): void {
    this.calculateEmployeeHours();
  }

  calculateEmployeeHours() {
    this.workTimeService.getWorkEntryData().subscribe(
      (data: WorkEntry[]) => {
        this.workEntries = data;

        for (const entry of this.workEntries) {
          if (entry.EmployeeName === null) {
            continue;
          }
          const employeeIndex = this.employees.findIndex(
            (emp) => emp.name === entry.EmployeeName
          );

          if (employeeIndex !== -1) {
            const startTime = new Date(entry.StarTimeUtc);
            const endTime = new Date(entry.EndTimeUtc);
            const entryTimeWorked =
              (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60); 
            this.employees[employeeIndex].totalTimeWorked += entryTimeWorked;
          } else {
            const startTime = new Date(entry.StarTimeUtc);
            const endTime = new Date(entry.EndTimeUtc);
            const totalTimeWorked =
              (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60); 

            const employee: Employee = {
              name: entry.EmployeeName,
              totalTimeWorked: totalTimeWorked,
            };

            this.employees.push(employee);
          }
        }
   
        this.employees.sort((a,b) => b.totalTimeWorked - a.totalTimeWorked);
      },
      (error) => {
        console.error('Error retrieving work entries:', error);
      }
    );
  }
}
