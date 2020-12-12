import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import menuItems, { IMenuItem } from 'src/app/constants/menu';
import { AuthService } from 'src/app/shared/auth.service';
import {
  SidebarService,
  ISidebar,
} from 'src/app/containers/layout/sidebar/sidebar.service';
import { Subscription } from 'rxjs';
import { DesignService } from 'src/app/services/design.service';
import { ItemStatus } from 'src/app/models/enums';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit, OnDestroy {
  menuItems: IMenuItem[];
  theId: number;
  theItem: IMenuItem;

  sidebar: ISidebar;
  subscription: Subscription;

  constructor(
    private sidebarService: SidebarService,
    public ds: DesignService
  ) {
    this.subscription = this.sidebarService.getSidebar().subscribe(
      (res) => {
        this.sidebar = res;
      },
      (err) => {
        console.error(`An error occurred: ${err.message}`);
      }
    );
    this.menuItems = menuItems;
    this.theId = 0;
    this.theItem = this.menuItems[0];
  }

  async ngOnInit(): Promise<void> {}

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  menuClicked(event) {
    event.stopPropagation();
  }

  menuItemClicked(event, item, index) {
    this.theId = index;
    this.theItem = item;

    this.ds.setStatus(ItemStatus.none);
  }
}
