import { Component, Input, OnInit } from '@angular/core';
import {
  trigger,
  style,
  animate,
  transition
} from '@angular/animations';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss'],
  animations: [
    trigger(
      'fadeTransition', [
        transition(':enter', [
          style({ opacity: 0 }),
          animate('200ms', style({ opacity: 1 }))
        ]),
        transition(':leave', [
          style({ opacity: 1 }),
          animate('200ms', style({ opacity: 0 }))
        ])
      ]
    )
  ]
})
export class PanelComponent implements OnInit {

  @Input() showPanel: boolean = false;
  @Input() typePanel: string = 'danger';
  @Input() messagePanel: string = '';

  constructor() {
  }

  ngOnInit() {
  }

}
