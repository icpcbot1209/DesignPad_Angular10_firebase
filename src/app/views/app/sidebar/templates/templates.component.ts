import { Component, OnInit } from '@angular/core';
import { AdminTemplates, UploadUserTemplate, UserData } from 'src/app/models/models';
import { FirebaseService } from 'src/app/services/firebase.service';
import { DesignService } from 'src/app/services/design.service';
import { UserRole } from 'src/app/shared/auth.roles';
import { MoveableService } from 'src/app/services/moveable.service';
import data from 'src/app/data/prices';
import { AuthService } from 'src/app/shared/auth.service';
import { Subject, Subscription } from 'rxjs';
import * as CSS from 'csstype';

@Component({
  selector: 'sidebar-templates',
  templateUrl: './templates.component.html',
  styleUrls: ['./templates.component.scss'],
})
export class TemplatesComponent implements OnInit {
  tabBar;
  templates: AdminTemplates[];
  userTemplates: UploadUserTemplate[];
  ratios: number[] = [];
  userRatios: number[] = [];
  currentRole = JSON.parse(localStorage.getItem('user')).role;
  role = UserRole;

  item$: Subscription;
  selectedItemTemp: number[] = [];
  selectedItemObserve = new Subject();
  count: number = 0;

  constructor(
    public firebaseSerivce: FirebaseService,
    public ds: DesignService,
    public moveableService: MoveableService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.readAdminTemplates();
    this.readUserTemplates();
  }

  ngAfterViewInit(): void {}

  readAdminTemplates() {
    this.firebaseSerivce.readAdminTemplates().subscribe((e) => {
      this.templates = e.map((data) => {
        return {
          docId: data.payload.doc.id,
          ...data.payload.doc.data(),
        } as AdminTemplates;
      });

      this.ratios = this.decideScale(this.templates, 2, this.padding);
    });
    this.item$ = this.selectedItemObserve.subscribe((items: []) => {
      this.count = items.length;
      if (items.length != 0) {
        (document.querySelector('#deleteAdminTemplateStatus') as HTMLElement).style.opacity = '1';
      } else {
        (document.querySelector('#deleteAdminTemplateStatus') as HTMLElement).style.opacity = '0';
      }
    });
  }

  async readUserTemplates() {
    // let users = (await this.firebaseSerivce.readUser(JSON.parse(localStorage.getItem('user')).uid)) as UserData;
    // this.userTemplates = users.template;
    // this.userRatios = this.decideScale(this.userTemplates, 2, this.padding);

    this.firebaseSerivce.readObservableUser(JSON.parse(localStorage.getItem('user')).uid).subscribe((e) => {
      let users = e.map((data) => {
        return {
          ...data.payload.doc.data(),
        } as UserData;
      });

      this.userTemplates = users[0].template;
      this.userRatios = this.decideScale(this.userTemplates, 2, this.padding);
    });
  }

  padding = 4;
  decideScale(templates, count, padding) {
    if (templates.length != 0) {
      let screenWidth = 330 - padding * 2 * count;
      let ratios: number[] = [];

      for (let i = 1; i < templates.length; i = i + 2) {
        let ratio = screenWidth / (templates[i].width + templates[i - 1].width);
        ratios.push(ratio);
        ratios.push(ratio);
      }

      if (this.templates.length % 2 == 1) {
        let ratio = 157 / templates[templates.length - 1].width;
        ratios.push(ratio);
      }

      return ratios;
    }
  }

  addTemplatePage(item: AdminTemplates) {
    this.ds.deleteSelectedItem();
    this.ds.onSelectNothing();
    this.moveableService.clearMoveable();
    this.ds.isTemplate = true;
    let screenWidth = this.ds.theDesign.category.size.x;
    let screenHeight = this.ds.theDesign.category.size.y;
    this.ds.theDesign.category.size.x = item.design.category.size.x;
    this.ds.theDesign.category.size.y = item.design.category.size.y;
    let ratio;
    let deltaX = 0;
    let deltaY = 0;

    this.ds.theDesign.pages[this.ds.thePageId].items = JSON.parse(JSON.stringify(item.design.pages[0].items));
    this.ds.theDesign.category.size.x = screenWidth;
    this.ds.theDesign.category.size.y = screenHeight;

    if (screenWidth != item.design.category.size.x || screenHeight != item.design.category.size.y) {
      if (screenWidth > screenHeight) {
        ratio = screenHeight / item.design.category.size.y;
        deltaX = (screenWidth - item.design.category.size.x * ratio) / 2;
      } else {
        ratio = screenWidth / item.design.category.size.x;
        deltaY = (screenHeight - item.design.category.size.y * ratio) / 2;
      }

      let pageItems = this.ds.theDesign.pages[this.ds.thePageId].items;
      for (let i = 0; i < pageItems.length; i++) {
        pageItems[i].selected = false;
        pageItems[i].scaleX = item.design.pages[0].items[i].scaleX * ratio;
        pageItems[i].scaleY = item.design.pages[0].items[i].scaleY * ratio;
        pageItems[i].x = item.design.pages[0].items[i].x * ratio + deltaX + (item.design.pages[0].items[i].w * (ratio - 1)) / 2;
        pageItems[i].y = item.design.pages[0].items[i].y * ratio + deltaY + (item.design.pages[0].items[i].h * (ratio - 1)) / 2;
      }
    }
  }

  addUserTemplatePage(i) {
    this.ds.isTemplate = true;
    console.log(this.userTemplates[0].design.pages[0].items);

    for (let i = 0; i < this.userTemplates.length; i++)
      for (let j = 0; j < this.userTemplates[i].design.pages[0].items.length; j++) {
        this.userTemplates[i].design.pages[0].items[j].selected = false;
      }
    this.ds.theDesign = JSON.parse(JSON.stringify(this.userTemplates[i].design));
  }

  overAdminTemplateItem(i) {
    if (document.querySelector('#adminTemplateItem' + i).getAttribute('selected') == 'false') {
      if (this.authService.user.role == this.role.Admin)
        (document.querySelector('#adminTemplateItem' + i).querySelector('div') as HTMLElement).style.display = 'block';
      (document.querySelector('#adminTemplateItem' + i).firstChild as HTMLElement).style.borderColor = '#f16624';
    }
    // if (document.querySelector('#adminTemplateItem' + i).getAttribute('selected') == 'true')
    //   (document.querySelector('#adminTemplateItem' + i).firstChild as HTMLElement).style.borderColor = '#f16624';
  }

  leaveAdminTemplateItem(i) {
    if (document.querySelector('#adminTemplateItem' + i).getAttribute('selected') == 'false') {
      if (this.authService.user.role == this.role.Admin)
        (document.querySelector('#adminTemplateItem' + i).querySelector('div') as HTMLElement).style.display = 'none';
      (document.querySelector('#adminTemplateItem' + i).firstChild as HTMLElement).style.borderColor = 'transparent';
    }
  }

  adminCheckBoxStyle(i): CSS.Properties {
    if (document.querySelector('#adminTemplateItem' + i).getAttribute('selected') == 'true') {
      return {
        background: '#f16624',
      };
    } else
      return {
        background: 'white',
      };
  }

  adminItemStyle(i, item): CSS.Properties {
    if (document.querySelector('#adminTemplateItem' + i).getAttribute('selected') == 'true') {
      return {
        height: item.height * this.ratios[i] + this.padding * 2 + 'px',
        borderColor: '#f16624',
      };
    } else
      return {
        height: item.height * this.ratios[i] + this.padding * 2 + 'px',
        borderColor: 'transparent',
      };
  }

  checkAdminItem(i: number) {
    if (document.querySelector('#adminTemplateItem' + i).getAttribute('selected') == 'false') {
      document.querySelector('#adminTemplateItem' + i).setAttribute('selected', 'true');
      this.selectedItemTemp.push(i);
      this.selectedItemObserve.next(this.selectedItemTemp);
    } else {
      document.querySelector('#adminTemplateItem' + i).setAttribute('selected', 'false');
      for (let j = 0; j < this.selectedItemTemp.length; j++) {
        if (this.selectedItemTemp[j] == i) {
          this.selectedItemTemp.splice(j, 1);
          j--;
        }
      }
      this.selectedItemObserve.next(this.selectedItemTemp);
    }
  }

  deleteAdminTemplate() {
    let arr: AdminTemplates[] = [];
    for (let i = 0; i < this.selectedItemTemp.length; i++) {
      arr.push(this.templates[this.selectedItemTemp[i]]);
    }

    for (let j = 0; j < this.selectedItemTemp.length; j++) {
      this.templates.splice(j, 1);
    }
    this.selectedItemTemp = [];
    this.selectedItemObserve.next(this.selectedItemTemp);

    this.firebaseSerivce.removeAdminTemplates(arr);
  }

  closeAdminTemplatePanel() {
    for (let i = 0; i < this.selectedItemTemp.length; i++) {
      if (document.querySelector('#adminTemplateItem' + this.selectedItemTemp[i]).getAttribute('selected') == 'true') {
        document.querySelector('#adminTemplateItem' + this.selectedItemTemp[i]).setAttribute('selected', 'false');
        (document.querySelector('#adminTemplateItem' + this.selectedItemTemp[i]).querySelector('div') as HTMLElement).style.display = 'none';
      }
    }
    this.selectedItemTemp = [];
    this.selectedItemObserve.next(this.selectedItemTemp);
  }
}
