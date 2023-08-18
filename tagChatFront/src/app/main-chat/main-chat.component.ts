import { Component, OnInit } from '@angular/core';
import { SocketService } from './socket.service';

@Component({
  selector: 'app-main-chat',
  templateUrl: './main-chat.component.html',
  styleUrls: ['./main-chat.component.css']
})
export class MainChatComponent implements OnInit {
  public messages: any[] = [];
  public username: string = '';
  public newMessage: string = '';

  constructor(private socketService: SocketService) {}

  ngOnInit(): void {
    // Connect to the Socket.io server
    this.socketService.connect();
    // Listen for 'output' event to receive chat history
    this.socketService.on('output', (data: any[]) => {
      this.messages = data;
      console.log("Populating: "+this.messages);
    });
  }

  sendMessage(): void {
    if (this.username === '' || this.newMessage === '') {
      return;
    }

    this.socketService.emit('input', {
      name: this.username,
      message: this.newMessage
    });

    this.newMessage = '';
    console.log('Message sent!');


  }
}
