import { Component, OnInit } from '@angular/core';
import { TagPanelService } from './tag-panel.service';
import { SharedTagService } from '../shared/shared-tag.service';

@Component({
  selector: 'app-tag-panel',
  templateUrl: './tag-panel.component.html',
  styleUrls: ['./tag-panel.component.css'],
})
export class TagPanelComponent implements OnInit {
  availableTags: any[] = [];
  selectedTags: any[] = [];

  constructor(private tagService: TagPanelService, private sharedTagService: SharedTagService) {}

  ngOnInit(): void {
    this.availableTags = this.tagService.getAvailableTags();
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
