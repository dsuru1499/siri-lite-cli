import {
  Component, OnInit,
  ApplicationRef, ComponentFactoryResolver, ComponentFactory, ComponentRef, Injector, NgZone, isDevMode
} from '@angular/core';
import * as L from 'leaflet';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import * as reducers from '../../reducers';
import * as StopPointsDiscoveryActions from '../../actions/stop-points-discovery.actions';
import { StopMonitoringComponent } from '../../components/stop-monitoring/stop-monitoring.component';
import { TripUpdateComponent } from '../../components/trip-update/trip-update.component';
import { from, timer } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';

declare var document: any;

@Component({
  selector: 'app-stop-points-discovery',
  templateUrl: './stop-points-discovery.component.html',
  styleUrls: ['./stop-points-discovery.component.css']
})
export class StopPointsDiscoveryComponent implements OnInit {

  public static MAPNIK = "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
  public static PARIS = new L.LatLng(48.866667, 2.333333);
  public static MAX_ZOOM = 17;

  private response$: Observable<any>;
  //private factory: ComponentFactory<any>;
  private map: L.Map;
  private markers: L.LayerGroup;
  private popups: L.LayerGroup;
  private bounds: L.LatLngBounds;
  private stopPointIcon: L.Icon;
  private stopAreaIcon: L.Icon;

  constructor(
    private application: ApplicationRef,
    private resolver: ComponentFactoryResolver,
    private zone: NgZone,
    private injector: Injector,
    private store: Store<reducers.State>) {
    this.response$ = this.store.select(reducers.sdResponse);

  }

  ngOnInit() {

    this.stopPointIcon = L.icon({
      iconUrl: 'assets/images/marker-icon.png',
      shadowUrl: 'assets/images/marker-shadow.png'
    });

    this.stopAreaIcon = L.icon({
      iconUrl: 'assets/images/marker-red-icon.png',
      shadowUrl: 'assets/images/marker-shadow.png'
    });

    this.map = new L.Map('map', {
      center: StopPointsDiscoveryComponent.PARIS,
      zoom: StopPointsDiscoveryComponent.MAX_ZOOM,
    });
    L.tileLayer(StopPointsDiscoveryComponent.MAPNIK, {}).addTo(this.map);
    this.markers = L.layerGroup([]).addTo(this.map);
    this.popups = L.layerGroup([]).addTo(this.map);
    L.control.scale().addTo(this.map);

    this.response$.pipe(filter(t => t !== undefined)).subscribe(t => this.update(t));
    this.map.on("moveend", this.load, this);
    this.load();
  }

  private load() {
    if (this.map.getZoom() >= StopPointsDiscoveryComponent.MAX_ZOOM) {
      let bounds = this.map.getBounds();
      let count: number = this.markers.getLayers().length;
      if (!this.bounds || !this.bounds.contains(bounds) || count === 0) {
        const dx: number = this.diff(bounds.getEast(), bounds.getWest());
        const dy: number = this.diff(bounds.getNorth(), bounds.getSouth());
        this.bounds = new L.LatLngBounds(
          new L.LatLng(bounds.getSouth() - dy, bounds.getWest() - dx),
          new L.LatLng(bounds.getNorth() + dy, bounds.getEast() + dx));

        let url = (isDevMode()) ? "http://127.0.0.1:8080" : "";
        url += "/siri-lite/stop-points-discovery"
          + "?" + StopPointsDiscoveryActions.LoadAction.UPPER_LEFT_LONGITUDE + '=' + this.bounds.getNorthWest().lng
          + "&" + StopPointsDiscoveryActions.LoadAction.UPPER_LEFT_LATITUDE + '=' + this.bounds.getNorthWest().lat
          + "&" + StopPointsDiscoveryActions.LoadAction.LOWER_RIGHT_LONGITUDE + '=' + this.bounds.getSouthEast().lng
          + "&" + StopPointsDiscoveryActions.LoadAction.LOWER_RIGHT_LATITUDE + '=' + this.bounds.getSouthEast().lat;
        this.store.dispatch(new StopPointsDiscoveryActions.LoadAction(url));
      }
    } else {
      this.store.dispatch(new StopPointsDiscoveryActions.LoadFailureAction(null));
    }
  }

  public diff(a: number, b: number): number {
    let result: number = (a * b > 0) ? Math.abs(b - a) : Math.abs(a) + Math.abs(b);
    return result;
  }

  private update(model) {
    this.markers.clearLayers();
    this.popups.clearLayers();
    if (model.Siri) {
      let array = model.Siri.StopPointsDelivery.AnnotatedStopPointRef;

      array.forEach(i => {
        let latlng = L.latLng(i.Location.Latitude, i.Location.Longitude);
        let options = {
          title: i.StopName["0"].value + "\n" + i.StopPointRef,
          alt: i.StopPointRef,
          icon: i.StopPointRef.startsWith("StopArea") ? this.stopAreaIcon : this.stopPointIcon,
        }
        let marker = L.marker(latlng, options);
        marker.on("click", (e) => {
          this.zone.run(() => {
            this.createPopup(marker, StopMonitoringComponent);
          });
        });
        marker.on("contextmenu", (e) => {
          this.zone.run(() => {
            this.createPopup(marker, TripUpdateComponent);
          });
        });
        this.markers.addLayer(marker);
      });
    }
  }

  private createPopup(marker: L.Marker, view: any) {
    let popup = marker.getPopup();
    if (popup) {
      popup.closePopup();
    } else {

      let popup = L.popup({ autoClose: false, closeOnClick: false, closeButton: false });
      popup.setLatLng(marker.getLatLng());

      let component = this.createComponent(view);
      let instance = component.instance;
      instance.name = marker.options.alt;
      instance.response$.subscribe(t => timer(100).subscribe((t) => popup.update()));

      marker.on("popupclose", () => {
        // console.log("popup close");
        marker.unbindPopup();
        component.destroy();
      });

      let div = document.createElement('div');
      div.appendChild(component.location.nativeElement);
      popup.setContent(div);
      marker.bindPopup(popup);
      this.popups.addLayer(popup);
    }
  }

  private createComponent(value: any): ComponentRef<any> {
    let factory = this.resolver.resolveComponentFactory(value);
    let component = factory.create(this.injector);
    // console.log("create component");
    // console.log(component);

    component.onDestroy((e) => {
      //console.log("destroy component " + component.instance.name);
      this.application.detachView(component.hostView);
    });
    this.application.attachView(component.hostView);

    return component;
  }

}
