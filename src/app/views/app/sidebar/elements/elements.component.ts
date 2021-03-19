import { Component, OnInit } from '@angular/core';
import { AssetElement } from 'src/app/models/models';
import { DesignService } from 'src/app/services/design.service';
import { AssetService } from 'src/app/services/asset.service';
import { MoveableService } from 'src/app/services/moveable.service';
import { Subject, Subscription } from 'rxjs';
import { AuthService } from 'src/app/shared/auth.service';
import { UserRole } from 'src/app/shared/auth.roles';

import * as CSS from 'csstype';

@Component({
  selector: 'sidebar-elements',
  templateUrl: './elements.component.html',
  styleUrls: ['./elements.component.scss'],
})
export class ElementsComponent implements OnInit {
  selector = '.scrollPanel';
  array = [];
  sum = 30;
  scrollDistance = 2;
  scrollUpDistance = 2;
  throttle = 300;
  direction = '';
  fonts;
  textPart: string = '';
  index: number;
  previousSelectedFontItemIndex: number = null;

  isLoading = false;
  assetElements: AssetElement[] = [];
  heights: number[] = [];

  item$: Subscription;
  selectedItemTemp: number[] = [];
  selectedItemObserve = new Subject();
  count: number = 0;
  role = UserRole;

  constructor(
    public assetService: AssetService,
    public ds: DesignService,
    public moveableService: MoveableService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.readElementByTag('');
    this.item$ = this.selectedItemObserve.subscribe((items: []) => {
      this.count = items.length;
      if (items.length != 0) {
        (document.querySelector('#deleteSvgStatus') as HTMLElement).style.opacity = '1';
      } else {
        (document.querySelector('#deleteSvgStatus') as HTMLElement).style.opacity = '0';
      }
    });
  }

  ngOnDestroy(): void {
    this.item$.unsubscribe();
  }

  readElementByTag(tag: string) {
    this.isLoading = true;
    this.assetService.readElementByTag(tag).subscribe((data) => {
      this.assetElements = data.map((e) => {
        return {
          uid: e.payload.doc.id,
          ...e.payload.doc.data(),
        } as AssetElement;
      });

      this.isLoading = false;
      this.array = [];
      this.appendItems(0, this.sum);
    });
  }

  onScrollDown(ev) {
    console.log('asdf');
    // add another 20 items
    const start = this.sum;
    this.sum += 30;
    this.appendItems(start, this.sum);

    this.direction = 'down';
  }

  appendItems(startIndex, endIndex) {
    this.addItems(startIndex, endIndex, 'push');
  }

  addItems(startIndex, endIndex, _method) {
    if (this.assetElements != []) {
      for (let i = startIndex; i < endIndex; ++i) {
        if (i >= this.assetElements.length) return;
        this.array[_method](this.assetElements[i]);
      }
    }
  }

  AddSVG(event, item) {
    if (event.type == 'click') {
      this.ds.sidebar_element_add(item);
    }
  }

  overImageItem(i) {
    if (document.querySelector('#adminSvgItem' + i).getAttribute('selected') == 'false') {
      if (this.authService.user.role == this.role.Admin)
        (document.querySelector('#adminSvgItem' + i).querySelector('div') as HTMLElement).style.display = 'block';
      (document.querySelector('#adminSvgItem' + i).firstChild as HTMLElement).style.borderColor = '#f16624';
    }
  }

  leaveImageItem(i) {
    if (document.querySelector('#adminSvgItem' + i).getAttribute('selected') == 'false') {
      if (this.authService.user.role == this.role.Admin)
        (document.querySelector('#adminSvgItem' + i).querySelector('div') as HTMLElement).style.display = 'none';
      (document.querySelector('#adminSvgItem' + i).firstChild as HTMLElement).style.borderColor = 'transparent';
    }
  }

  checkBoxStyle(i): CSS.Properties {
    if (document.querySelector('#adminSvgItem' + i).getAttribute('selected') == 'true') {
      return {
        background: '#f16624',
      };
    } else
      return {
        background: 'white',
      };
  }

  imageItemStyle(i): CSS.Properties {
    if (document.querySelector('#adminSvgItem' + i).getAttribute('selected') == 'true') {
      return {
        borderColor: '#f16624',
      };
    } else
      return {
        borderColor: 'transparent',
      };
  }

  scrollHeight(): CSS.Properties {
    let offsetHeight = (document.querySelector('#searchElementInput') as HTMLElement).clientHeight;
    return {
      height: `calc(100% - ${offsetHeight}px)`,
    };
  }

  checkItem(i: number) {
    if (document.querySelector('#adminSvgItem' + i).getAttribute('selected') == 'false') {
      document.querySelector('#adminSvgItem' + i).setAttribute('selected', 'true');
      this.selectedItemTemp.push(i);
      this.selectedItemObserve.next(this.selectedItemTemp);
    } else {
      document.querySelector('#adminSvgItem' + i).setAttribute('selected', 'false');
      for (let j = 0; j < this.selectedItemTemp.length; j++) {
        if (this.selectedItemTemp[j] == i) {
          this.selectedItemTemp.splice(j, 1);
          j--;
        }
      }
      this.selectedItemObserve.next(this.selectedItemTemp);
    }
  }

  deleteImageItem() {
    let arr: AssetElement[] = [];
    for (let i = 0; i < this.selectedItemTemp.length; i++) {
      arr.push(this.assetElements[this.selectedItemTemp[i]]);
    }
    for (let j = 0; j < this.selectedItemTemp.length; j++) {
      this.assetElements.splice(this.selectedItemTemp[j], 1);
    }

    this.selectedItemTemp = [];
    this.selectedItemObserve.next(this.selectedItemTemp);
    this.assetService.removeElements(arr);
  }

  closePanel() {
    for (let i = 0; i < this.selectedItemTemp.length; i++) {
      if (document.querySelector('#adminSvgItem' + this.selectedItemTemp[i]).getAttribute('selected') == 'true') {
        document.querySelector('#adminSvgItem' + this.selectedItemTemp[i]).setAttribute('selected', 'false');
        (document.querySelector('#adminSvgItem' + this.selectedItemTemp[i]).querySelector('div') as HTMLElement).style.display = 'none';
      }
    }
    this.selectedItemTemp = [];
    this.selectedItemObserve.next(this.selectedItemTemp);
  }
}
