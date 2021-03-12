import { Component, OnInit } from '@angular/core';
import { AdminTemplates, UploadUserTemplate, UserData } from 'src/app/models/models';
import { FirebaseService } from 'src/app/services/firebase.service';
import { DesignService } from 'src/app/services/design.service';
import { UserRole } from 'src/app/shared/auth.roles';

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

  constructor(public firebaseSerivce: FirebaseService, public ds: DesignService) {}

  ngOnInit(): void {
    this.readAdminTemplates();
    this.readUserTemplates();
  }

  ngAfterViewInit(): void {}

  readAdminTemplates() {
    this.firebaseSerivce.readAdminTemplates().subscribe((e) => {
      this.templates = e.map((data) => {
        return {
          ...data.payload.doc.data(),
        } as AdminTemplates;
      });

      this.ratios = this.decideScale(this.templates, 2, this.padding);
    });
  }

  readUserTemplates() {
    // this.firebaseSerivce.readUser(JSON.parse(localStorage.getItem('user')).uid).subscribe((e) => {
    //   let users = e.map((data) => {
    //     return {
    //       ...data.payload.doc.data(),
    //     } as User;
    //   });
    //   this.userTemplates = users[0].template;
    //   this.userRatios = this.decideScale(this.userTemplates, 2, this.padding);
    // });
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
        let ratio = 165 / templates[templates.length - 1].width;
        ratios.push(ratio);
      }

      return ratios;
    }
  }

  addTemplatePage(item: AdminTemplates) {
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
    for (let i = 0; i < this.userTemplates[i].design.pages[0].items.length; i++) {
      this.userTemplates[i].design.pages[0].items[i].selected = false;
    }
    this.ds.theDesign = JSON.parse(JSON.stringify(this.userTemplates[i].design));
  }
}
