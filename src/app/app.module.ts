import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { PhoneCallComponent } from './phone-call/phone-call.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelect2Module, Select2OptionData } from 'ng-select2';
import { ReceiveCallComponent } from './receive-call/receive-call.component';

@NgModule({
  declarations: [
    AppComponent,
    PhoneCallComponent,
    ReceiveCallComponent
  ],
  imports: [
    BrowserModule,
    NgbModule,
    NgSelect2Module
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
