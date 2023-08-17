import { Component } from '@angular/core';
import { io } from 'socket.io-client';

@Component({
  selector: 'app-main-chat',
  templateUrl: './main-chat.component.html',
  styleUrls: ['./main-chat.component.css']
})
export class MainChatComponent {
  private socket: any;
  public messages: any[] = [];
  public username: string = '';
  public newMessage: string = '';

  ngOnInit(): void {
    // Connect to the Socket.io server
    this.socket = io('http://localhost:3000');

    // Listen for 'output' event to receive chat history
    this.socket.on('output', (data: any[]) => {
      this.messages = data;
      console.log(this.messages);

    });
  }

  sendMessage(): void {
    if (this.username === '' || this.newMessage === '') {
      return;
    }

    // Emit 'input' event to send a new message
    this.socket.emit('input', {
      name: this.username,
      message: this.newMessage

    });
    console.log('sent front');

    // Clear the new message input
    this.newMessage = '';

  }
}
