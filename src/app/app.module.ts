import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { MatButtonModule, MatCheckboxModule } from '@angular/material';
import { RouterModule, Routes } from '@angular/router';

import { LocalComponent } from './local/local.component';
import { ChessComponent } from './chess/chess.component';
import { OnlineComponent } from './online/online.component';

const appRoutes: Routes = [
  { path: 'local', component: LocalComponent },
  { path: 'online', component: OnlineComponent },
  { path: '', component: ChessComponent },
];


@NgModule({
  declarations: [
    AppComponent,
    LocalComponent,
    ChessComponent,
    OnlineComponent
  ],
  imports: [
    BrowserModule,
    MatButtonModule,
    MatCheckboxModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
