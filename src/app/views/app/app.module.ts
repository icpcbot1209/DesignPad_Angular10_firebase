import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing';
import { SharedModule } from 'src/app/shared/shared.module';
import { LayoutContainersModule } from 'src/app/containers/layout/layout.containers.module';
import { UploaderModule } from './sidebar/uploader/uploader.module';
import { TopnavComponent } from './topnav/topnav.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { DesignPanelComponent } from './design-panel/design-panel.component';
import { PageComponent } from './page/page.component';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { TouchPanelComponent } from './touch-panel/touch-panel.component';
import { PhotosComponent } from './sidebar/photos/photos.component';
import { ItemComponent } from './item/item.component';
import { RemoveHostDirective } from './remove-host.directive';
import { NgxMoveableModule } from 'ngx-moveable';
import { TargetComponent } from './target/target.component';

@NgModule({
  declarations: [
    AppComponent,
    TopnavComponent,
    SidebarComponent,
    DesignPanelComponent,
    PageComponent,
    TouchPanelComponent,
    PhotosComponent,
    ItemComponent,
    RemoveHostDirective,
    TargetComponent,
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
  ],
})
export class AppModule {}
