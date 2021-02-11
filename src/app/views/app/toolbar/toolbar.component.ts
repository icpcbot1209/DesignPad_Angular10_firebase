import { Component, OnDestroy, OnInit } from '@angular/core';
import { Colors } from 'src/app/constants/colors.service';
import { ItemStatus, ItemType } from 'src/app/models/enums';
import { DesignService } from 'src/app/services/design.service';
import { MoveableService } from 'src/app/services/moveable.service';
import html2canvas from 'html2canvas';

import { jsPDF } from 'jspdf';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent implements OnInit {
  constructor(public ds: DesignService, public moveableService: MoveableService) {}

  activeColor = Colors.getColors().separatorColor;
  ItemType = ItemType;
  ItemStatus = ItemStatus;

  ngOnInit(): void {}

  downloadToPdf() {
    let doc = new jsPDF('l', 'px', [534, 445]);
    let imgEle = document.querySelector(
      '#imageElement-' + this.moveableService.selectedPageId + '-' + this.moveableService.selectedItemId
    ) as HTMLElement;

    console.log(imgEle);
    // html2canvas(imgEle).then((canvas) => {
    //   var imgData = canvas.toDataURL('image/png');
    //   console.log(imgData)

    //   var pageHeight = 295;
    //   var imgWidth = (canvas.width * 50) / 210;
    //   var imgHeight = (canvas.height * imgWidth) / canvas.width;
    //   var heightLeft = imgHeight;
    //   var position = 15;

    //   doc.addImage(imgData, 'jpg', 0, position, imgWidth, imgHeight);
    //   heightLeft -= pageHeight;
    // });

    // doc.html(document.body.querySelectorAll('.card')[0].children[0] as HTMLElement, {
    //   callback: function (doc) {
    //     doc.save('asdf.pdf');
    //   },
    // });
  }
}
