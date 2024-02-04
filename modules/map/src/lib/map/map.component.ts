import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { VsmBottomDrawerComponent } from '@vessel-ship-management/core';
import { Subject } from 'rxjs';
import { VesselRoute } from './models/vessel-route.model';

//UI COMPONENTS
import { VesselsRouteMapComponent } from './ui/vessels-route-map/vessels-route-map.component';
import { VesselRouteListComponent } from './ui/vessel-route-list/vessel-route-list.component';
import { VesselRouteSpeedChartComponent } from './ui/vessel-route-speed-chart/vessel-route-speed-chart.component';

@Component({
  selector: 'vsm-vessel-ship-management-map',
  standalone: true,
  imports: [
    CommonModule,
    MatSidenavModule,
    MatButtonModule,
    VsmBottomDrawerComponent,
    VesselRouteListComponent,
    VesselsRouteMapComponent,
    VesselRouteSpeedChartComponent,
  ],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss',
})
export class MapComponent {
  @ViewChild('drawer') matDrawer: MatDrawer | undefined;
  @ViewChild('bottomDrawer') bottomDrawer: VsmBottomDrawerComponent | undefined;

  selectedVesselRoute$: Subject<VesselRoute> = new Subject();

  toggleSideNav(): void {
    this.matDrawer?.toggle();
  }

  onItemClicked(vesselRoute: VesselRoute): void {
    this.selectedVesselRoute$.next(vesselRoute);
    if (this.bottomDrawer?.drawerState === 'closed') {
      this.bottomDrawer?.toggleDrawer();
    }
  }
}
