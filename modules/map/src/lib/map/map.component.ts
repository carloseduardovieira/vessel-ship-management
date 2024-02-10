import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { Subject } from 'rxjs';
import { VesselRoute } from './models/vessel-route.model';
import { VesselObservation } from './enums/vessel-observation.enum';
import { MapControllerService } from './map-controller.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { VsmBottomDrawerComponent } from '@vessel-ship-management/core';

//UI COMPONENTS
import { VesselsRouteMapComponent } from './ui/vessels-route-map/vessels-route-map.component';
import { VesselRouteSpeedChartComponent } from './ui/vessel-route-speed-chart/vessel-route-speed-chart.component';
import { VesselRouteListComponent } from './ui/vessel-route-list/vessel-route-list.component';

@Component({
  selector: 'vsm-vessel-ship-management-map',
  standalone: true,
  imports: [
    CommonModule,
    MatSidenavModule,
    MatButtonModule,
    VsmBottomDrawerComponent,
    VesselsRouteMapComponent,
    VesselRouteSpeedChartComponent,
    MatToolbarModule,
    MatIconModule,
    VesselRouteListComponent,
  ],
  providers: [
    MapControllerService,
    {
      provide: 'VsmListManagement',
      useExisting: MapControllerService,
    },
  ],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapComponent {
  @ViewChild('bottomDrawer') bottomDrawer: VsmBottomDrawerComponent | undefined;

  selectedVesselRoute$: Subject<VesselRoute> = new Subject();

  private selectedRoute: VesselRoute | undefined;

  onItemClicked(vesselRoute: VesselRoute): void {
    if (this.selectedRoute?.route_id !== vesselRoute?.route_id) {
      vesselRoute.points = this.sortObservationPoints(vesselRoute.points);
      this.selectedVesselRoute$.next(vesselRoute);
    }

    if (this.bottomDrawer?.drawerState === 'closed') {
      this.bottomDrawer?.toggleDrawer();
    }
  }

  private sortObservationPoints(
    points: VesselObservation[][]
  ): VesselObservation[][] {
    return points.sort(
      (a, b) => a[VesselObservation.TIMESTAMP] - b[VesselObservation.TIMESTAMP]
    );
  }
}
