import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  ChangeDetectionStrategy,
} from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { Observable } from 'rxjs';

@Component({
  selector: 'vsm-list',
  standalone: true,
  imports: [CommonModule, MatListModule],
  templateUrl: './vsm-list.component.html',
  styleUrl: './vsm-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VsmListComponent {
  @Output() itemClicked: EventEmitter<any> = new EventEmitter();
  @Input() itemList: Observable<any[]> | undefined;
  @Input() bindId: string = 'id';
  @Input() bindLabel: string = 'name';
}
