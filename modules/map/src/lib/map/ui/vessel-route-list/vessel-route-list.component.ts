import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { VesselRoute } from '../../models/vessel-route.model';
import {
  Observable,
  Subject,
  Subscription,
  debounceTime,
  distinctUntilChanged,
  map,
  of,
  switchMap,
} from 'rxjs';

import { VesselsService } from '../../data-access/vessels.service';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatIconModule } from '@angular/material/icon';
import {
  MsToHourPipe,
  stringOrNumberValidator,
} from '@vessel-ship-management/core';
import {
  MAT_FORM_FIELD_DEFAULT_OPTIONS,
  MatFormFieldModule,
} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'vsm-vessel-route-list',
  templateUrl: './vessel-route-list.component.html',
  styleUrls: ['./vessel-route-list.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatListModule,
    ScrollingModule,
    MatIconModule,
    MsToHourPipe,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        subscriptSizing: 'dynamic',
      },
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VesselRouteListComponent implements OnInit, OnDestroy {
  @Output() itemClicked: EventEmitter<VesselRoute> = new EventEmitter();

  vesselRouteList$: Subject<VesselRoute[]> = new Subject();
  searchInputControl: FormControl = new FormControl('', [
    stringOrNumberValidator,
  ]);

  private subscriptions = new Subscription();

  constructor(private vesselsService: VesselsService) {}

  ngOnInit() {
    this.initVesselRouteList();
    this.watchSearchControlChanges();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private initVesselRouteList(): void {
    this.vesselsService.getVesselRouteList().subscribe({
      next: (vesselRouteList) => {
        this.vesselRouteList$.next(vesselRouteList);
      },
    });
  }

  private watchSearchControlChanges(): void {
    this.subscriptions.add(
      this.searchInputControl.valueChanges
        .pipe(
          debounceTime(500),
          distinctUntilChanged(),
          switchMap((queryString: string) => {
            if (this.searchInputControl.valid) {
              return this.searchInVesselList(
                queryString.toLocaleLowerCase()
              ) as Observable<VesselRoute[]>;
            }
            return of([]);
          })
        )
        .subscribe({
          next: (routeList: VesselRoute[]) => {
            this.vesselRouteList$.next(routeList);
          },
        })
    );
  }

  private searchInVesselList(query: string): Observable<VesselRoute[]> {
    return this.vesselsService.getVesselRouteList().pipe(
      map((routeList: VesselRoute[]) => {
        return routeList.filter(
          (route) =>
            route.from_port.toLowerCase().includes(query) ||
            route.to_port.toLocaleLowerCase().includes(query)
        );
      })
    );
  }
}
