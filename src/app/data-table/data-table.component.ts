import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { EmployeeWorkTimeService } from '../services/employee-work-time.service';
import { WorkEntry } from '../model/work-entry';
import { Employee } from '../model/employee';
import { Chart, PieController, ArcElement, Legend } from 'chart.js';
import 'chartjs-plugin-datalabels';
import ChartDataLabels from 'chartjs-plugin-datalabels';
@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css'],
})
export class DataTableComponent implements OnInit {
  @ViewChild('pieChart') pieChartRef: ElementRef;
  pieChart: any;

  constructor(private workTimeService: EmployeeWorkTimeService) {
    Chart.register(PieController, ArcElement, Legend, ChartDataLabels);
  }

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

        this.employees.sort((a, b) => b.totalTimeWorked - a.totalTimeWorked);

        this.renderPieChart();
      },
      (error) => {
        console.error('Error retrieving work entries:', error);
      }
    );
  }

  renderPieChart() {
    const pieChartCanvas = this.pieChartRef.nativeElement;
    const employeeNames = this.employees.map((employee) => employee.name);
    const totalTimeWorked = this.employees.map(
      (employee) => employee.totalTimeWorked
    );

    if (this.pieChart) {
      this.pieChart.destroy();
    }

    this.pieChart = new Chart(pieChartCanvas, {
      type: 'pie',
      data: {
        labels: employeeNames,
        datasets: [
          {
            data: totalTimeWorked,
            backgroundColor: [
              'rgba(255, 99, 132, 0.8)',
              'rgba(54, 162, 235, 0.8)',
              'rgba(255, 206, 86, 0.8)',
              'rgba(75, 192, 192, 0.8)',
              'rgba(153, 102, 255, 0.8)',
              'rgba(255, 159, 64, 0.8)',
              'rgba(0, 255, 0, 0.8)',
              'rgba(255, 0, 0, 0.8)',
              'rgba(0, 0, 255, 0.8)',
              'rgba(128, 128, 128, 0.8)',
            ],
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
            labels: {
              font: {
                size: 12,
              },
            },
          },
          tooltip: {
            enabled: false,
          },
          datalabels: {
            formatter: (value: number, ctx: any) => {
              const dataset = ctx.chart.data.datasets[ctx.datasetIndex];
              const total = dataset.data.reduce(
                (acc: any, cur: any) => acc + cur
              );
              const percentage = ((value / total) * 100).toFixed(2);
              return `${percentage}%`;
            },
            color: '#fff',
            font: {
              weight: 'bold',
              size: 12,
            },
            textStrokeColor: 'rgba(0, 0, 0, 0.7)',
            textStrokeWidth: 1,
          },
        },
      },
    });
  }
}
