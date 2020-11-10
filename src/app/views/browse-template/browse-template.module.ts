import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowseTemplateComponent } from './browse-template.component';
import { BrowseTemplateRoutingModule } from './browse-template.routing.module';
import { SearchTemplateComponent } from './search-template/search-template.component';
import { ComponentsCarouselModule } from 'src/app/components/carousel/components.carousel.module';
@NgModule({
  declarations: [BrowseTemplateComponent, SearchTemplateComponent],
  imports: [
    CommonModule,
    BrowseTemplateRoutingModule,
    ComponentsCarouselModule,
  ],
})
export class BrowseTemplateModule {}
