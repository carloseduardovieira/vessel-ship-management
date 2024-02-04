import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';

@Component({
  selector: 'vsm-bottom-drawer',
  standalone: true,
  imports: [],
  templateUrl: './vsm-bottom-drawer.component.html',
  styleUrl: './vsm-bottom-drawer.component.scss',
  animations: [
    trigger('slideAnimation', [
      state(
        'open',
        style({
          transform: 'translateY(0%)',
        })
      ),
      state(
        'closed',
        style({
          transform: 'translateY(100%)',
        })
      ),
      transition('open <=> closed', [animate('0.4s ease-in-out')]),
    ]),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VsmBottomDrawerComponent {
  drawerState: 'open' | 'closed' = 'closed';
  constructor(private cd: ChangeDetectorRef) {}

  toggleDrawer() {
    this.drawerState = this.drawerState === 'closed' ? 'open' : 'closed';
    this.cd.markForCheck();
  }
}
