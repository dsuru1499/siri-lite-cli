import { Injectable } from '@angular/core';
import { HttpClientModule, HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs'
import * as $protobuf from 'protobufjs';
import * as Gtfs from './gtfs-realtime';
import { map, catchError } from 'rxjs/operators';

@Injectable()
export class TripUpdateService {

  constructor(private http: HttpClient) { }

  public get(url: string): Observable<Object> {

    const headers = new HttpHeaders({
      'Accept': 'application/octet-stream'
    });

    return this.http.get(url, { headers: headers, responseType: 'arraybuffer' }).pipe(
        map(response => {
          const buffer = new Uint8Array(response);
          return Gtfs.transit_realtime.FeedMessage.decode(buffer);
        }),
        catchError(this.onError)
      );
  }

  protected onError(error: any) {
    console.log(error);
    return Observable.throw('failure');
  }
}
