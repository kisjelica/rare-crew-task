import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { WorkEntry } from '../model/work-entry';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class EmployeeWorkTimeService {

  private url = environment.EmployeeApiUrl;
  constructor(private httpClient: HttpClient) { }

  getWorkEntryData(): Observable<WorkEntry[]> {
    return this.httpClient.get<WorkEntry[]>(this.url);
  }
}
