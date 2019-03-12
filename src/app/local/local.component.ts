import { Component, OnInit, ViewEncapsulation, ElementRef, ViewChild, AfterViewInit} from '@angular/core';
import { MOVE_INPUT_MODE, COLOR, Chessboard } from 'cm-chessboard';
@Component({
  selector: 'app-local',
  templateUrl: './local.component.html',
  styleUrls: ['./local.component.css'],
  encapsulation: ViewEncapsulation.None,
  template: `<div width="100%" height="100%" #board></div>`
})
export class LocalComponent implements AfterViewInit {
    @ViewChild('board') board: ElementRef;
    ngAfterViewInit() {
    console.log(this.board.nativeElement.innerHTML);
    new Chessboard(this.board.nativeElement,
        {
            position: "start",
            responsive: true,
        })
    }
}
