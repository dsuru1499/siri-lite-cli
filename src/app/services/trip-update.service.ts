import { Injectable } from '@angular/core';
import { Http, Headers, Response, ResponseContentType } from '@angular/http';
import { Observable } from "rxjs/Rx"
import * as $protobuf from "protobufjs";
import * as Gtfs from "./gtfs-realtime";

@Injectable()
export class TripUpdateService {

  constructor(private http: Http) { }

  public get(url: string): Observable<Response> {

    let headers = new Headers({
      'Accept': 'application/octet-stream'
    });

    return this.http.get(url, { headers: headers, responseType: ResponseContentType.ArrayBuffer })
      .map(response => {
        let buffer = new Uint8Array(response.arrayBuffer());
        return Gtfs.transit_realtime.FeedMessage.decode(buffer);
      })
      .catch(this.onError);
  }

  protected onError(error: any) {
    console.log(error);
    return Observable.throw('failure');
  }
}
