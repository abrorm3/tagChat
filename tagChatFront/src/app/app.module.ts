import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { MainChatComponent } from './main-chat/main-chat.component';
import { AppRoutingModule } from './app-routing.module';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { environment } from './environment';
import { LoadingSpinnerComponent } from './shared/loadingSpinner/loading-spinner.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { TagPanelComponent } from './tag-panel/tag-panel.component';

const config: SocketIoConfig = {
	url: environment.socketUrl, // socket server url;
	options: {
		transports: ['websocket']
	}
}
@NgModule({
  declarations: [AppComponent, MainChatComponent, TagPanelComponent,LoadingSpinnerComponent],
  imports: [BrowserModule,ReactiveFormsModule, NgSelectModule,AppRoutingModule, FormsModule,SocketIoModule.forRoot(config)],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
