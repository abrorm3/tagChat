import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedTagService {

  private selectedTags: string[] = [];
  private selectedTagsSubject = new Subject<string[]>();

  setSelectedTags(tags: string[]): void {
    this.selectedTags = tags;
    this.selectedTagsSubject.next(this.selectedTags);
  }

  getSelectedTagsSubject(): Subject<string[]> {
    return this.selectedTagsSubject;
  }
}
