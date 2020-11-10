import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TemplateService } from 'src/app/services/template.service';

@Component({
  selector: 'app-browse-template',
  templateUrl: './browse-template.component.html',
  styleUrls: ['./browse-template.component.scss'],
})
export class BrowseTemplateComponent implements OnInit {
  categoryTypes = [
    { title: 'Social Media', isSelected: true },
    { title: 'Events', isSelected: true },
    { title: 'Marketing', isSelected: true },
    { title: 'Documents', isSelected: true },
    { title: 'Prints', isSelected: true },
    { title: 'Video', isSelected: true },
    { title: 'School', isSelected: true },
    { title: 'Personal', isSelected: true },
  ];

  constructor(
    private templateService: TemplateService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.searchByFilter('');
  }

  data = [];
  async searchByFilter(filterStr) {
    this.data = await this.templateService.searchByFilter({ filterStr });
  }

  onBackClick() {}
}
