import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SocketService } from './socket.service';
import { SharedTagService } from '../shared/shared-tag.service';

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
  tags: string[] = [];
  selectedTags: string[] = [];
  filteredMessages: any[] = [];
  isLoading = false;

  constructor(
    private socketService: SocketService,
    private sharedTagService: SharedTagService
  ) {}
  @ViewChild('scrollMe', { static: false })
  private scrollContainer!: ElementRef;

  ngOnInit(): void {
    this.sharedTagService.getSelectedTagsSubject().subscribe((tags) => {
      this.selectedTags = tags;
      this.filterMessages();
      this.applyTagFilter();
    });

    this.isLoading = true;
    this.socketService.connect();
    this.socketService.on('output', (data: any[]) => {
      this.messages = [...this.messages, data];
      this.filterMessages();
      this.applyTagFilter();
    });

    // Fetch initial messages from the server
    this.socketService.on('records', (data: any[]) => {
      this.messages = data;
      this.filterMessages();
      this.applyTagFilter();
      this.isLoading = false;
    });

    this.socketService.on('filteredMessages', (filteredMessages) => {
      this.filteredMessages = filteredMessages;
      if (this.username) {
        const ownMessages = this.messages.filter(
          (message) => message.name === this.username
        );
        this.filteredMessages.push(...ownMessages);
      }
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
    } else if (this.newMessage === '') {
      this.errorMessage = 'Please enter a message.';
      return;
    }
    this.isLoading = true;
    this.socketService.emit('input', {
      name: this.username,
      message: this.newMessage,
      tags: this.selectedTags,
    });

    this.newMessage = '';
    this.isLoading = false;
    console.log('Message sent!');
    this.filterMessages();
    this.applyTagFilter();
  }
  filterMessages(): void {
    this.filteredMessages = this.messages.filter((message) => {
      if (!this.selectedTags || this.selectedTags.length === 0) {
        // Show messages without tags when no tags are selected
        return !message.tags || message.tags.length === 0;
      }

      // Show messages with selected tags as well as messages without tags
      return (
        !message.tags ||
        message.tags.length === 0 ||
        message.tags.some((tag: string) => this.selectedTags.includes(tag))
      );
    });
  }
  applyTagFilter(): void {
    if (this.selectedTags.length > 0) {
      this.filteredMessages = this.filteredMessages.filter((message) => {
        if (!message.tags || message.tags.length === 0) {
          return true; // Show messages without tags
        }

        return (
          message.tags.some((tag: string) => this.selectedTags.includes(tag)) ||
          message.name === this.username
        );
      });
    } else {
      // If no tags are selected, show messages without tags
      this.filteredMessages = this.messages.filter(
        (message) => !message.tags || message.tags.length === 0
      );
    }
  }
  messageHasMatchingTags(message: any): boolean {
    if (!this.selectedTags || this.selectedTags.length === 0) {
      // If no tags are selected, show the message only if it has no tags
      return !message.tags || message.tags.length === 0;
    }

    if (!message.tags || message.tags.length === 0) {
      // If the message has no tags, show the message
      return true;
    }

    // Check if the message tags have at least one tag in common with selected tags
    return message.tags.some((tag: string) => this.selectedTags.includes(tag));
  }



}
