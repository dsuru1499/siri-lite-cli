import { Injectable } from '@angular/core';
import { HttpClientModule, HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable} from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable()
export class StopPointsDiscoveryService {

  constructor(private http: HttpClient) { }

  public get(url: string): Observable<Object> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    })

    return this.http.get(url, { headers: headers }).pipe(
      // map(response => response.json()),
      catchError(this.onError)
    );
  }

  protected onError(error: any) {
    console.log(error);
    return Observable.throw('failure');
  }
}
