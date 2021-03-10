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

    console.log(this.ratios);
  }

  addTemplatePage(item) {
    let cards = document.querySelectorAll('.card');
    console.log(this.ds.theDesign.pages.length);
  }
}
