import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { VesselRoute } from '../../models/vessel-route.model';
import { Observable } from 'rxjs';
import { VesselsService } from '../../data-access/vessels.service';
import { ScrollingModule } from '@angular/cdk/scrolling';

@Component({
  selector: 'vsm-vessel-route-list',
  templateUrl: './vessel-route-list.component.html',
  styleUrls: ['./vessel-route-list.component.scss'],
  standalone: true,
  imports: [CommonModule, MatListModule, ScrollingModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VesselRouteListComponent implements OnInit {
  @Output() itemClicked: EventEmitter<VesselRoute> = new EventEmitter();
  @Input() vesselRouteList$: Observable<VesselRoute[]> | undefined;

  constructor(private vesselsService: VesselsService) {}

  ngOnInit() {
    this.initVesselRouteList();
  }

  private initVesselRouteList(): void {
    this.vesselRouteList$ = this.vesselsService.getVesselRouteList();
  }
}
