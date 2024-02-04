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
  HostListener,
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
  isResizing = false;

  constructor(private cd: ChangeDetectorRef) {}

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (this.isResizing) {
      // Handle resizing logic based on the mouse position
      // Update the drawer height or any other property as needed
      // For example: this.drawerHeight = event.clientY - this.initialMouseY;
    }
  }

  @HostListener('document:mouseup')
  onMouseUp() {
    this.isResizing = false;
  }

  onMouseDown(event: MouseEvent) {
    // Handle click on the drawer
    // You can add logic to handle clicks inside the drawer, if needed
  }

  onResizeHandleMouseDown(event: MouseEvent) {
    // Handle the mouse down event on the resize handle
    // this.isResizing = true;
    // You may want to store initial mouse coordinates or other data for resizing
  }

  toggleDrawer() {
    this.drawerState = this.drawerState === 'closed' ? 'open' : 'closed';
    this.cd.markForCheck();
  }
}
