import { Component, OnInit } from '@angular/core';
import { AssetElement } from '../../../../../src/app/models/models';
import { AssetService } from '../../../../../src/app/services/asset.service';
import { DesignService } from '../../../../../src/app/services/design.service';
import { AuthService } from '../../../../../src/app/shared/auth.service';

@Component({
  selector: 'app-elements',
  templateUrl: './elements.component.html',
  styleUrls: ['./elements.component.scss'],
})
export class ElementsComponent implements OnInit {
  constructor(public assetService: AssetService, public authService: AuthService, private ds: DesignService) {}

  ngOnInit() {
    this.readElementByFilter('');
  }

  files: File[] = [];

  onDrop(files: FileList) {
    for (let i = 0; i < files.length; i++) {
      if (files.item(i).type == 'image/svg+xml') {
        this.files.push(files.item(i));
      }
    }
  }

  isLoading = false;
  assetElements: AssetElement[] = [];
  readElementByFilter(tag: string) {
    this.isLoading = true;
    this.assetService.readElementByTag(tag).subscribe((data) => {
      this.assetElements = data.map((e) => {
        return {
          uid: e.payload.doc.id,
          ...e.payload.doc.data(),
        } as AssetElement;
      });

      this.isLoading = false;
    });
  }

  addTagFn(addedTag: string): string {
    return addedTag;
  }

  onAddRemoveTag(assetElement: AssetElement) {
    this.assetService.updateElementTags(assetElement);
  }

  removeSelected() {
    this.assetService.removeElements(this.selected);
  }

  selected: AssetElement[] = [];
  isSelected(p: AssetElement): boolean {
    return this.selected.findIndex((x) => x.uid === p.uid) > -1;
  }
  onSelect(item: AssetElement): void {
    if (this.isSelected(item)) {
      this.selected = this.selected.filter((x) => x.uid !== item.uid);
    } else {
      this.selected.push(item);
    }
    this.setSelectAllState();
  }

  selectAllState = '';
  setSelectAllState(): void {
    if (this.selected.length === this.assetElements.length) {
      this.selectAllState = 'checked';
    } else if (this.selected.length !== 0) {
      this.selectAllState = 'indeterminate';
    } else {
      this.selectAllState = '';
    }
  }

  selectAllChange($event): void {
    if ($event.target.checked) {
      this.selected = [...this.assetElements];
    } else {
      this.selected = [];
    }
    this.setSelectAllState();
  }

  onSearchKeyUp(event) {
    if (event.keyCode === 13) {
      this.readElementByFilter(event.target.value);
    }
  }
}
