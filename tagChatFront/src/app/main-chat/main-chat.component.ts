import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SocketService } from './socket.service';

@Component({
  selector: 'app-main-chat',
  templateUrl: './main-chat.component.html',
  styleUrls: ['./main-chat.component.css'],
})
export class MainChatComponent implements OnInit {
  public messages: any[] = [];
  public username: string = '';
  public newMessage: string = '';
  public errorMessage: string = '';
  selectedTags: string[] = [];
  isLoading = false;

  constructor(private socketService: SocketService) {}
  @ViewChild('scrollMe', { static: false })
  private scrollContainer!: ElementRef;

  ngOnInit(): void {
    this.isLoading=true;
    this.socketService.connect();
    this.socketService.on('output', (data: any[]) => {
      this.messages = [...this.messages, data];
    });
    this.socketService.on('records', (data: any[]) => {
      this.messages = data;
      this.isLoading=false;
    });

  }
  ngAfterViewChecked() {
    this.scrollToBottom();
  }
  private scrollToBottom(): void {
    try {
      this.scrollContainer.nativeElement.scrollTop =
        this.scrollContainer.nativeElement.scrollHeight;
    } catch (err) {
      console.log(err);
    }
  }

  sendMessage(): void {
    this.errorMessage = '';
    if (this.username === '') {
      this.errorMessage = 'Please enter a name.';
      return;
    }else if(this.newMessage === ''){
      this.errorMessage = 'Please enter a message.';
      return;
    }
    this.isLoading=true;
    this.socketService.emit('input', {
      name: this.username,
      message: this.newMessage,
    });

    this.newMessage = '';
    this.isLoading=false;
    console.log('Message sent!');
  }
  messageHasMatchingTags(message: any): boolean {
    if (!message.tags || message.tags.length === 0) {
      return true; // Show messages without tags
    }

    // Check if any of the message's tags match the user's selected tags
    return message.tags.some((tag: string) => this.selectedTags.includes(tag));
  }

}
