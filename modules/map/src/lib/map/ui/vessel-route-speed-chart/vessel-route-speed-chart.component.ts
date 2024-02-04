import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Observable, Subscription, map } from 'rxjs';
import { VesselRoute } from '../../models/vessel-route.model';
import { Chart } from 'chart.js/auto';
import { VesselObservation } from '../../enums/vessel-observation.enum';
import { CommonModule } from '@angular/common';
import { DateUtils } from '@vessel-ship-management/core';

interface ChartData {
  chartLabels: string[];
  chartData: number[];
}

@Component({
  selector: 'vsm-vessel-route-speed-chart',
  template: `
    <div class="chart-canvas-container">
      <div [style.width.px]="chartDataCount * 20" class="chart-canvas-block">
        <canvas id="speedChart" height="300" width="0"></canvas>
      </div>
    </div>
  `,
  styles: [
    `
      .chart-canvas-container {
        height: 100%;
        width: 100%;
        overflow-x: auto;
        overflow-y: hidden;
      }

      .chart-canvas-block {
        height: 100%;
        max-width: 30000px;
        position: relative;
      }
    `,
  ],
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VesselRouteSpeedChartComponent implements OnInit, OnDestroy {
  @Input() currentVesselRoute$: Observable<VesselRoute> | undefined;

  chart: Chart | undefined;
  chartDataCount = 0;

  private subscriptions = new Subscription();

  constructor(private cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.watchVesselRouteChanges();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private createChart(data: ChartData): void {
    const chartLabels = data.chartLabels;
    const chartDatasetsData = data.chartData;

    if (!this.chart) {
      this.chart = new Chart('speedChart', {
        type: 'line',
        data: {
          labels: chartLabels,
          datasets: [
            {
              label: 'Speed Changes Over Time (Knots)',
              data: chartDatasetsData,
            },
          ],
        },
        options: {
          maintainAspectRatio: false,
          responsive: true,
        },
      });
      return;
    }

    this.chart.data.labels = chartLabels;
    this.chart.data.datasets[0].data = chartDatasetsData;
    this.chart.update();
  }

  private watchVesselRouteChanges(): void {
    this.subscriptions.add(
      this.currentVesselRoute$
        ?.pipe(
          map((vesselRoute: VesselRoute) => {
            const chartData = this.initChartData(vesselRoute);
            this.chartDataCount = chartData.chartData.length;
            this.cd.markForCheck();
            return chartData;
          })
        )
        .subscribe({
          next: (chartData: ChartData) => {
            this.createChart(chartData);
          },
        })
    );
  }

  private initChartData(vesselRoute: VesselRoute): ChartData {
    const chartData: ChartData = {
      chartLabels: [],
      chartData: [],
    };

    vesselRoute.points.forEach((point: number[]) => {
      const speed = point[VesselObservation.SPEED];
      if (
        speed &&
        speed !== chartData.chartData[chartData.chartData.length - 1]
      ) {
        chartData.chartLabels.push(
          DateUtils.epochToDate(point[VesselObservation.TIMESTAMP])
        );
        chartData.chartData.push(speed);
      }
    });

    return chartData;
  }
}
