import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';

import * as mapboxgl from 'mapbox-gl';
import { VesselRoute } from '../../models/vessel-route.model';
import { VesselObservation } from '../../enums/vessel-observation.enum';
import { environment } from '@vessel-ship-management/core';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'vsm-vessels-route-map',
  template: `
    <div class="map-container">
      <div id="map" class="map-container__mapbox"></div>
    </div>
  `,
  styles: [
    `
      .map-container {
        height: 100%;
        width: 100%;
        overflow: hidden;

        &__mapbox {
          height: inherit;
          width: inherit;
        }
      }
    `,
  ],
  imports: [],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VesselsRouteMapComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  @Input() currentVesselRoute$: Observable<VesselRoute> | undefined;

  private map: mapboxgl.Map | undefined;
  private style = 'mapbox://styles/mapbox/streets-v11';
  private lat = -0.3063185;
  private lng = 9.1887756;
  private subscriptions = new Subscription();

  ngOnInit(): void {
    this.watchVesselRouteSelectionChanges();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.map = new mapboxgl.Map({
      accessToken: environment.mboxKey,
      container: 'map',
      style: this.style,
      zoom: 1,
      center: [this.lng, this.lat],
    });
  }

  private watchVesselRouteSelectionChanges(): void {
    this.subscriptions.add(
      this.currentVesselRoute$?.subscribe({
        next: (vesselRoute: VesselRoute) => this.drawRoute(vesselRoute),
      })
    );
  }

  private drawRoute(vesselRoute: VesselRoute): void {
    if (!this.map) {
      return;
    }

    const coordinates: [number, number][] = vesselRoute.points.map((point) => [
      point[VesselObservation.LATITUDE],
      point[VesselObservation.LONGITUDE],
    ]);

    const dataSource: mapboxgl.GeoJSONSourceRaw = {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates,
        },
      },
    };

    if (!this.map.getSource('route')) {
      this.map.addSource('route', dataSource);
    } else {
      (this.map.getSource('route') as mapboxgl.GeoJSONSource).setData(
        dataSource.data as GeoJSON.Feature<GeoJSON.Geometry>
      );
    }

    if (!this.map.getLayer('route')) {
      this.map.addLayer({
        id: 'route',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': '#888',
          'line-width': 8,
        },
      });
    }

    this.flyToInitialVesselPosition(coordinates);
  }

  private flyToInitialVesselPosition(positions: [number, number][]): void {
    if (!this.map) {
      return;
    }

    const bounds = new mapboxgl.LngLatBounds();
    positions.forEach(function (coord) {
      bounds.extend(coord);
    });

    this.map.fitBounds(bounds, { padding: 50 });
  }
}
