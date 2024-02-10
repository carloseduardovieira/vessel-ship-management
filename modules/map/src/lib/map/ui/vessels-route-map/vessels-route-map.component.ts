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

    this.createConnectionLineLayer(coordinates);
    this.createMapDataSource(vesselRoute.points);
    this.flyToInitialVesselPosition(coordinates);
  }

  private flyToInitialVesselPosition(positions: [number, number][]): void {
    if (!this.map) {
      return;
    }

    const bounds = new mapboxgl.LngLatBounds();
    positions.forEach((coord) => {
      bounds.extend(coord);
    });

    this.map.fitBounds(bounds, { padding: 50 });
  }

  private createMapDataSource(coordinates: VesselObservation[][]): void {
    if (!this.map) {
      return;
    }

    const subCoordinates = this.createSubCoordinatesArray(coordinates);
    const features: GeoJSON.Feature<GeoJSON.Geometry>[] = [];

    subCoordinates.forEach((coordinates: VesselObservation[][]) => {
      features.push({
        type: 'Feature',
        properties: {
          color:
            coordinates[0][VesselObservation.SPEED] > 0.9
              ? '#508D69'
              : '#FA7070',
        },
        geometry: {
          type: 'LineString',
          coordinates: coordinates,
        },
      });
    });

    if (this.map && !this.map.getLayer('lines')) {
      this.map.addLayer({
        id: 'lines',
        type: 'line',
        source: {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features,
          },
        },
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': ['get', 'color'],
          'line-width': 8,
        },
      });
    } else {
      (this.map.getSource('lines') as mapboxgl.GeoJSONSource).setData({
        type: 'FeatureCollection',
        features,
      });
    }
  }

  private createConnectionLineLayer(coordinates: VesselObservation[][]): void {
    if (!this.map) {
      return;
    }

    const geojsonData = {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: coordinates,
      },
    };

    if (this.map && !this.map.getLayer('connectionLine')) {
      this.map.addLayer({
        id: 'connectionLine',
        type: 'line',
        source: {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: coordinates,
            },
          },
        },
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': '#FA7070',
          'line-width': 8,
        },
      });
    } else {
      (this.map.getSource('connectionLine') as mapboxgl.GeoJSONSource).setData(
        geojsonData as GeoJSON.Feature<GeoJSON.Geometry>
      );
    }
  }

  /**
   * This method ensures that a new sub coordinate array is started if the
   * current subarray contains elements with speed values on opposite sides of 1
   * @param coordinates: VesselObservation[][]
   * @returns VesselObservation[][][]
   */
  createSubCoordinatesArray(
    coordinates: VesselObservation[][]
  ): VesselObservation[][][] {
    const subCoordinates: VesselObservation[][][] = [];
    const lowSpeed = 1;
    const highSpeed = 1.1;
    let currentSubCoordinate = [];

    const pushSubCoordinate = (currentSubCoordinate: VesselObservation[][]) => {
      subCoordinates.push(currentSubCoordinate);
    };

    for (const item of coordinates) {
      if (item[VesselObservation.SPEED] < lowSpeed) {
        if (
          currentSubCoordinate.length > 0 &&
          currentSubCoordinate[0][VesselObservation.SPEED] >= highSpeed
        ) {
          pushSubCoordinate(currentSubCoordinate);
          currentSubCoordinate = [];
        }
      } else if (item[VesselObservation.SPEED] >= highSpeed) {
        if (
          currentSubCoordinate.length > 0 &&
          currentSubCoordinate[0][VesselObservation.SPEED] < highSpeed
        ) {
          pushSubCoordinate(currentSubCoordinate);
          currentSubCoordinate = [];
        }
      }
      currentSubCoordinate.push(item);
    }

    if (currentSubCoordinate.length > 0) {
      pushSubCoordinate(currentSubCoordinate);
    }

    return subCoordinates;
  }
}
