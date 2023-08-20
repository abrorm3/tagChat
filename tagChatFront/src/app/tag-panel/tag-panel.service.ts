import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TagPanelService {
  chosenTags: string[] = [];
  constructor() { }

  getAvailableTags(): string[] {
    // Return some example available tags
    return ['TagA', 'TagB', 'TagC','Testing','Game','World of Warcraft','diko'];
  }
  sendTag(tag: string){
    this.chosenTags.push(tag);
  }
}
