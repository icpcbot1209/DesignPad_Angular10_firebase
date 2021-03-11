import { Component, OnInit } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { from } from 'rxjs';
import { AdminTemplates } from 'src/app/models/models';
import { FirebaseService } from 'src/app/services/firebase.service';
import { DesignService } from 'src/app/services/design.service';

@Component({
  selector: 'sidebar-templates',
  templateUrl: './templates.component.html',
  styleUrls: ['./templates.component.scss'],
})
export class TemplatesComponent implements OnInit {
  tabBar;
  templates: AdminTemplates[];
  ratios: number[] = [];

  constructor(public firebaseSerivce: FirebaseService, public ds: DesignService) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.readAdminTemplates();
  }

  readAdminTemplates() {
    this.firebaseSerivce.readAdminTemplates().subscribe((e) => {
      this.templates = e.map((data) => {
        return {
          ...data.payload.doc.data(),
        } as AdminTemplates;
      });

      this.decideScale(this.templates, 2, this.padding);
    });
  }

  padding = 4;
  decideScale(templates: AdminTemplates[], count, padding) {
    let screenWidth = 330 - padding * 2 * count;

    for (let i = 1; i < templates.length; i = i + 2) {
      let ratio = screenWidth / (templates[i].width + templates[i - 1].width);
      this.ratios.push(ratio);
      this.ratios.push(ratio);
    }

    if (this.templates.length % 2 == 1) {
      let ratio = 165 / templates[templates.length - 1].width;
      this.ratios.push(ratio);
    }
  }

  addTemplatePage(item: AdminTemplates) {
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
        pageItems[i].scaleX = item.design.pages[0].items[i].scaleX * ratio;
        pageItems[i].scaleY = item.design.pages[0].items[i].scaleY * ratio;
        pageItems[i].x = item.design.pages[0].items[i].x * ratio + deltaX + (item.design.pages[0].items[i].w * (ratio - 1)) / 2;
        pageItems[i].y = item.design.pages[0].items[i].y * ratio + deltaY + (item.design.pages[0].items[i].h * (ratio - 1)) / 2;
      }
    }
  }
}
