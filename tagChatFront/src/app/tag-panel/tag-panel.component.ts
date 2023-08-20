import { Component, OnInit } from '@angular/core';
import { SharedTagService } from '../shared/shared-tag.service';
import { SocketService } from '../main-chat/socket.service';

@Component({
  selector: 'app-tag-panel',
  templateUrl: './tag-panel.component.html',
  styleUrls: ['./tag-panel.component.css'],
})
export class TagPanelComponent implements OnInit {
  availableTags: any[] = [];
  selectedTags: any[] = [];

  constructor(private sharedTagService: SharedTagService, private socketService:SocketService) {}

  ngOnInit(): void {
    this.fetchTags();
  }
  fetchTags(){
    this.socketService.on('records', (data: any[]) => {
      this.availableTags = this.extractTagsFromMessages(data);
    });
  }
  private extractTagsFromMessages(messages: any[]): string[] {
    const tagsSet = new Set<string>();
    messages.forEach((message) => {
      if (message.tags && message.tags.length > 0) {
        message.tags.forEach((tag: string) => {
          tagsSet.add(tag);
        });
      }
    });
    return Array.from(tagsSet);
  }

  addTag(tagName: string) {
    if (!this.selectedTags.includes(tagName)) {
      this.selectedTags.push(tagName);
      this.sharedTagService.setSelectedTags(this.selectedTags);
    }

  }

  addTagFromInput() {
    const tagName = (document.getElementById('tag-input') as HTMLInputElement).value.trim();
    if (tagName && !this.selectedTags.includes(tagName)) {
      this.selectedTags.push(tagName);
      (document.getElementById('tag-input') as HTMLInputElement).value = '';
      this.sharedTagService.setSelectedTags(this.selectedTags);
      this.fetchTags();
    }

  }

  removeTag(index: number) {
    this.selectedTags.splice(index, 1);
    this.sharedTagService.setSelectedTags(this.selectedTags);
  }

  toggleTag(index: number) {
    this.selectedTags.splice(index, 1);
    this.sharedTagService.setSelectedTags(this.selectedTags);
  }
}
