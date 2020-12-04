import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ToolbarService {
  constructor() {}

  STATUS = () => ({
    none: 0,
    image: 1,
    text: 2,
  });

  status = this.STATUS().none;

  IMAGE_STATUS = () => ({
    none: 0,
    filter: 1,
    adjust: 2,
    crop: 3,
    flip: 4,
  });

  image_status = this.IMAGE_STATUS().none;

  showToolpanel() {
    return (
      this.status !== this.STATUS().none &&
      this.image_status !== this.IMAGE_STATUS().none
    );
  }
}
