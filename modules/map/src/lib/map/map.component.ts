import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { VsmBottomDrawerComponent } from '@vessel-ship-management/core';

@Component({
  selector: 'vessel-ship-management-map',
  standalone: true,
  imports: [
    CommonModule,
    MatSidenavModule,
    MatButtonModule,
    VsmBottomDrawerComponent,
  ],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss',
})
export class MapComponent {
  @ViewChild('drawer') matDrawer: MatDrawer | undefined;
  @ViewChild('bottomDrawer') bottomDrawer: VsmBottomDrawerComponent | undefined;

  toggleSideNav(): void {
    this.matDrawer?.toggle();
    this.bottomDrawer?.toggleDrawer();
  }
}
