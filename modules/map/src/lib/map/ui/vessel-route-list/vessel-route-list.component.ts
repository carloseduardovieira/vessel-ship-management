import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
} from '@angular/core';

import { VesselRoute } from '../../models/vessel-route.model';
import { MsToHourPipe, VsmListComponent } from '@vessel-ship-management/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'vsm-vessel-route-list',
  templateUrl: './vessel-route-list.component.html',
  styleUrls: ['./vessel-route-list.component.scss'],
  standalone: true,
  imports: [VsmListComponent, MsToHourPipe, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VesselRouteListComponent {
  @Output() itemClicked: EventEmitter<VesselRoute> = new EventEmitter();
}
