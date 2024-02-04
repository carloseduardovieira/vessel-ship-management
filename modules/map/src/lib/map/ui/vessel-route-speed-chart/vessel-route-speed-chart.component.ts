import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { Observable } from 'rxjs';
import { VesselRoute } from '../../models/vessel-route.model';

@Component({
  selector: 'vsm-vessel-route-speed-chart',
  templateUrl: './vessel-route-speed-chart.component.html',
  styleUrls: ['./vessel-route-speed-chart.component.scss'],
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VesselRouteSpeedChartComponent implements OnInit {
  @Input() currentVesselRoute$: Observable<VesselRoute> | undefined;

  ngOnInit() {}
}
