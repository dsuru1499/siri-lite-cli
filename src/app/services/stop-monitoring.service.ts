import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from "rxjs/Rx"

@Injectable()
export class StopMonitoringService {

  constructor(private http: Http) { }

  public get(url: string): Observable<Response> {
    let headers = new Headers({
      'Content-Type': 'application/json'
    })

    return this.http.get(url, { headers: headers })
      .map(response => response.json())
      .catch(this.onError);
  }

  protected onError(error: any) {
    console.log(error);
    return Observable.throw('failure');
  }
}
