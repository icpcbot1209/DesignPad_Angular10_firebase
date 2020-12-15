import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { QuillModule } from 'ngx-quill';

import { LayoutContainersModule } from 'src/app/containers/layout/layout.containers.module';

import { UploaderModule } from '../1/uploader/uploader.module';
import { TopnavComponent } from './topnav/topnav.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { DesignPanelComponent } from './design-panel/design-panel.component';
import { PageComponent } from './page/page.component';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { PhotosComponent } from './sidebar/photos/photos.component';
import { ItemComponent } from './item/item.component';
import { RemoveHostDirective } from './remove-host.directive';
import { NgxMoveableModule } from 'ngx-moveable';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { UserUploadsComponent } from './sidebar/user-uploads/user-uploads.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { MaterialModule } from 'src/app/material.module';
import { ToolpanelComponent } from './toolpanel/toolpanel.component';
import { NouisliderModule } from 'ng2-nouislider';
import { FilterComponent } from './toolpanel/filter/filter.component';
import { PresetComponent } from './toolpanel/preset/preset.component';
import { TextComponent } from './sidebar/text/text.component';

@NgModule({
  declarations: [
    AppComponent,
    TopnavComponent,
    SidebarComponent,
    DesignPanelComponent,
    PageComponent,
    PhotosComponent,
    ItemComponent,
    RemoveHostDirective,
    UserUploadsComponent,
    ToolbarComponent,
    ToolpanelComponent,
    FilterComponent,
    PresetComponent,
    TextComponent,
  ],
  imports: [
    CommonModule,
    CollapseModule,
    FormsModule,
    ReactiveFormsModule,
    BsDropdownModule.forRoot(),
    TooltipModule.forRoot(),
    TabsModule.forRoot(),
    AppRoutingModule,
    SharedModule,
    LayoutContainersModule,
    UploaderModule,
    NgxMoveableModule,
    QuillModule.forRoot(),
    LazyLoadImageModule,
    MaterialModule,
    NouisliderModule,
    NgSelectModule,
  ],
})
export class AppModule {}
