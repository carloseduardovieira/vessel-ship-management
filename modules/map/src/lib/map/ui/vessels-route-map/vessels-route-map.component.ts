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

    vesselRoute.points = this.sortObservationPoints(vesselRoute.points);

    const coordinates: [number, number][] = vesselRoute.points.map((point) => [
      point[VesselObservation.LATITUDE],
      point[VesselObservation.LONGITUDE],
    ]);

    this.createMapDataSource(vesselRoute.points);
    this.flyToInitialVesselPosition(coordinates);
  }

  private createMapLayer(index: number, color = 'red'): void {
    if (!this.map) {
      return;
    }

    console.log('color', color);

    // if (this.map && !this.map.getLayer('route')) {
    this.map.addLayer({
      id: 'route' + index,
      type: 'line',
      source: 'route' + index,
      paint: {
        'line-color': color,
        'line-width': 8,
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
    });
    // }
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

  private createDataSource(
    index: number,
    coordinates: [VesselObservation[][]]
  ): void {
    if (!this.map) {
      return;
    }

    const dataSource: any = {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: coordinates.map((coordinate) => [
            coordinate[VesselObservation.LATITUDE],
            coordinate[VesselObservation.LONGITUDE],
          ]),
        },
      },
    };

    this.map.addSource('route' + index, dataSource);
  }

  private createMapDataSource(coordinates: VesselObservation[][]): void {
    if (!this.map) {
      return;
    }

    // Define coordinates for each connection between layers
    const subCoordinates = this.createSubCoordinatesArray(coordinates);

    // Add line layers to connect the layers
    // this.map.addLayer({
    //   id: 'line-layer1',
    //   type: 'line',
    //   source: {
    //     type: 'geojson',
    //     data: {
    //       type: 'Feature',
    //       properties: {},
    //       geometry: {
    //         type: 'LineString',
    //         coordinates: subCoordinates[0],
    //       },
    //     },
    //   },
    //   layout: {
    //     'line-join': 'round',
    //     'line-cap': 'round',
    //   },
    //   paint: {
    //     'line-color': '#888',
    //     'line-width': 8,
    //   },
    // });

    // this.map.addLayer({
    //   id: 'line-layer2',
    //   type: 'line',
    //   source: {
    //     type: 'geojson',
    //     data: {
    //       type: 'Feature',
    //       properties: {},
    //       geometry: {
    //         type: 'LineString',
    //         coordinates: subCoordinates[1],
    //       },
    //     },
    //   },
    //   layout: {
    //     'line-join': 'round',
    //     'line-cap': 'round',
    //   },
    //   paint: {
    //     'line-color': '#888',
    //     'line-width': 8,
    //   },
    // });

    // this.map.addLayer({
    //   id: 'line-layer3',
    //   type: 'line',
    //   source: {
    //     type: 'geojson',
    //     data: {
    //       type: 'Feature',
    //       properties: {},
    //       geometry: {
    //         type: 'LineString',
    //         coordinates: subCoordinates[2],
    //       },
    //     },
    //   },
    //   layout: {
    //     'line-join': 'round',
    //     'line-cap': 'round',
    //   },
    //   paint: {
    //     'line-color': '#888',
    //     'line-width': 8,
    //   },
    // });

    // console.log(coordinates);

    // console.log(subCoordinates);
    // subCoordinates.forEach((coordinates: any, index: number) => {
    //   console.log('coordi', coordinates);
    //   this.createDataSource(index, coordinates as any);
    //   this.createMapLayer(
    //     index,
    //     coordinates[0][VesselObservation.SPEED] > 0.9 ? '#508D69' : '#FA7070'
    //   );
    // });

    // console.log(subarrays);
    // coordinates.forEach((coordinate: VesselObservation[], i) => {
    //   // console.log('coordinate', coordinate[VesselObservation.SPEED]);
    //   // const lineColor =
    //   //   coordinate[VesselObservation.SPEED] > 0.9 ? '#508D69' : '#FA7070';

    //   dataSource.data.features;

    //   if (coordinate[VesselObservation.SPEED] < 1) {
    //     console.log('one');
    //   } else {
    //     console.log('two');
    //   }

    //   dataSource.data?.geometry.coordinates.push([
    //     coordinate[VesselObservation.LATITUDE],
    //     coordinate[VesselObservation.LONGITUDE],
    //   ]);

    //   dataSource.data.geometry.layer;
    //   // dataSource.data.properties.color = 'red';
    // });

    // console.log('datasource', dataSource);

    // if (!this.map.getSource('route')) {

    // } else {
    //   (this.map.getSource('route') as mapboxgl.GeoJSONSource).setData(
    //     dataSource.data as GeoJSON.Feature<GeoJSON.Geometry>
    //   );
    // }
  }

  private sortObservationPoints(
    points: VesselObservation[][]
  ): VesselObservation[][] {
    return points.sort(
      (a, b) => a[VesselObservation.TIMESTAMP] - b[VesselObservation.TIMESTAMP]
    );
  }

  /**
   * This method ensures that a new sub coordinate array is started if the
   * current subarray contains elements with speed values on opposite sides of 1
   * @param coordinates: VesselObservation[][]
   * @returns
   */
  private createSubCoordinatesArray(coordinates: VesselObservation[][]) {
    const subCoordinates: any = [];
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
