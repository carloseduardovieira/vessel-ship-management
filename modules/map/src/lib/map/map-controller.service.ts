import { Injectable } from '@angular/core';
import { VsmListManagement } from '@vessel-ship-management/core';
import { VesselRoute } from './models/vessel-route.model';
import { Observable, map } from 'rxjs';
import { VesselsService } from './data-access/vessels.service';

@Injectable()
export class MapControllerService implements VsmListManagement<VesselRoute> {
  constructor(private vesselsService: VesselsService) {}

  getListItems(): Observable<VesselRoute[]> {
    return this.vesselsService.getVesselRouteList();
  }

  searchInItemList(query: string): Observable<VesselRoute[]> {
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
