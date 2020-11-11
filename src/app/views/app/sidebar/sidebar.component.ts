import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import menuItems, { IMenuItem } from 'src/app/constants/menu';
import { AuthService } from 'src/app/shared/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit, OnDestroy {
  menuItems: IMenuItem[];
  theId: number;
  theItem: IMenuItem;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService
  ) {
    this.menuItems = menuItems;
    this.theId = 0;
    this.theItem = this.menuItems[0];
  }

  async ngOnInit(): Promise<void> {}

  ngOnDestroy(): void {}

  menuClicked(event) {
    event.stopPropagation();
  }

  menuItemClicked(event, item, index) {
    this.theId = index;
    this.theItem = item;
  }
}
