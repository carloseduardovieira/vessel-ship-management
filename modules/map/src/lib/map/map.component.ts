import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import {
  VsmBottomDrawerComponent,
  VsmListComponent,
} from '@vessel-ship-management/core';
import { Observable } from 'rxjs';
import { VesselRoute } from './models/vessel-route.model';
import { VesselsService } from './data-access/vessels.service';

@Component({
  selector: 'vessel-ship-management-map',
  standalone: true,
  imports: [
    CommonModule,
    MatSidenavModule,
    MatButtonModule,
    VsmBottomDrawerComponent,
    VsmListComponent,
  ],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss',
})
export class MapComponent implements OnInit {
  @ViewChild('drawer') matDrawer: MatDrawer | undefined;
  @ViewChild('bottomDrawer') bottomDrawer: VsmBottomDrawerComponent | undefined;

  vesselList$: Observable<VesselRoute[]> | undefined;

  constructor(private vesselsService: VesselsService) {}

  ngOnInit(): void {
    this.initVesselRouteList();
  }

  toggleSideNav(): void {
    this.matDrawer?.toggle();
    this.bottomDrawer?.toggleDrawer();
  }

  onItemClicked(vesselRoute: VesselRoute): void {
    // TODO CALL MAP
  }

  private initVesselRouteList(): void {
    this.vesselList$ = this.vesselsService.getVesselRouteList();
  }
}
