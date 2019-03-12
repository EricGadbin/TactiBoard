import { Component, OnInit, ViewEncapsulation, ElementRef, ViewChild, AfterViewInit} from '@angular/core';
import { INPUT_EVENT_TYPE, MOVE_INPUT_MODE, COLOR, Chessboard } from 'cm-chessboard';
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
    var tab = new Chessboard(this.board.nativeElement,
        {
            position: "empty", // set as fen, "start" or "empty"
            orientation: COLOR.white, // white on bottom
            style: {
                cssClass: "default",
                showCoordinates: false, // show ranks and files
                showBorder: false, // display a border around the board
            },
            responsive: true, // resizes the board on window resize, if true
            animationDuration: 300, // pieces animation duration in milliseconds
            moveInputMode: MOVE_INPUT_MODE.dragPiece, // set to MOVE_INPUT_MODE.dragPiece or MOVE_INPUT_MODE.dragMarker for interactive movement
        })
        tab.setPosition('start');
        tab.enableMoveInput((event) => {
            switch (event.type) {
                case INPUT_EVENT_TYPE.moveStart:
                console.log(`moveStart: ${event.square}`)
                // return `true`, if input is accepted/valid, `false` aborts the interaction, the piece will not move
                return true
                case INPUT_EVENT_TYPE.moveDone:
                console.log(`moveDone: ${event.squareFrom}-${event.squareTo}`)
                // return true, if input is accepted/valid, `false` takes the move back
                return true
                case INPUT_EVENT_TYPE.moveCanceled:
                console.log(`moveCanceled`)
            }
        }, COLOR.white);
        tab.enableMoveInput((event) => {
            switch (event.type) {
                case INPUT_EVENT_TYPE.moveStart:
                console.log(`moveStart: ${event.square}`)
                // return `true`, if input is accepted/valid, `false` aborts the interaction, the piece will not move
                return true
                case INPUT_EVENT_TYPE.moveDone:
                console.log(`moveDone: ${event.squareFrom}-${event.squareTo}`)
                // return true, if input is accepted/valid, `false` takes the move back
                return true
                case INPUT_EVENT_TYPE.moveCanceled:
                console.log(`moveCanceled`)
            }
        }, COLOR.black);
    }
}
