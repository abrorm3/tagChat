import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { MainChatComponent } from './main-chat/main-chat.component';
import { TagPanelComponent } from './main-chat/tag-panel/tag-panel.component';
import { AppRoutingModule } from './app-routing.module';
import { SocketIoConfig } from 'ngx-socket-io';
import { environment } from './environment';

const config: SocketIoConfig = {
	url: environment.socketUrl, // socket server url;
	options: {
		transports: ['websocket']
	}
}
@NgModule({
  declarations: [AppComponent, MainChatComponent, TagPanelComponent],
  imports: [BrowserModule, AppRoutingModule, FormsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
