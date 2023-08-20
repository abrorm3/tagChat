// tag-panel.component.ts

import { Component, OnInit } from '@angular/core';
import { TagPanelService } from './tag-panel.service';

@Component({
  selector: 'app-tag-panel',
  templateUrl: './tag-panel.component.html',
  styleUrls: ['./tag-panel.component.css'],
})
export class TagPanelComponent implements OnInit {
  availableTags: any[] = []; // Initialize an array to store available tags
  selectedTags: any[] = [];

  constructor(private tagService: TagPanelService) {}

  ngOnInit(): void {
    // Fetch available tags from your service
    this.availableTags = this.tagService.getAvailableTags();
  }

  addTag(tagName: string) {
    if (!this.selectedTags.includes(tagName)) {
      this.selectedTags.push(tagName);
    }
  }

  addTagFromInput() {
    const tagName = (document.getElementById('tag-input') as HTMLInputElement).value.trim();
    if (tagName && !this.selectedTags.includes(tagName)) {
      this.selectedTags.push(tagName);
      (document.getElementById('tag-input') as HTMLInputElement).value = '';
    }
  }
  removeTag(index: number) {
    this.selectedTags.splice(index, 1);
  }

  toggleTag(index: number) {
    this.selectedTags.splice(index, 1); // Remove the clicked tag

    // You can also handle adding the tag back to the input field if needed
    // Example: this.addTag(tagName);
  }
}
