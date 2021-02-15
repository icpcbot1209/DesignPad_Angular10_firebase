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
    let xhr = new XMLHttpRequest();
    let formData = new FormData();

    document.querySelectorAll('.ql-editor').forEach((ele) => {
      let element = ele as HTMLElement;
      console.log(ele.parentElement.children[2]);
      if (ele.parentElement.children[2]) {
        ele.parentElement.children[2].remove();
      }
    });

    let ele = document.querySelectorAll('.card')[0] as HTMLElement;

    let width = ele.clientWidth;
    let height = ele.clientHeight;
    let htmlContent: string = '';

    document.querySelectorAll('.card').forEach((ele) => {
      let htmlStr = ele.outerHTML;
      if (htmlStr.indexOf('<div class="ql-editor"')) {
        htmlStr =
          document.querySelector('head').outerHTML +
          htmlStr.slice(0, htmlStr.indexOf('<div class="ql-editor"')) +
          htmlStr.slice(htmlStr.indexOf('<p>'), htmlStr.length); //htmlContent.indexOf('</div>', htmlContent.indexOf('<p>'))
      }

      htmlContent += htmlStr;
    });
    formData.append('text', htmlContent);
    formData.append('page_width', width + 'px');
    formData.append('page_height', height + 'px');
    formData.append('no_margins', 'True');
    formData.append('content_area_x', '-8px');
    formData.append('content_area_y', '-8px');

    xhr.responseType = 'blob';
    xhr.onload = (event) => {
      var blob = xhr.response;

      var fr = new FileReader();
      fr.onload = (result) => {
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
          window.navigator.msSaveOrOpenBlob(blob);
          return;
        }
        const url = window.URL.createObjectURL(blob);
        var link = document.createElement('a');
        link.href = url;
        link.download = 'result.pdf';
        link.click();
      };
      fr.readAsText(blob);
    };

    xhr.open('POST', 'https://api.pdfcrowd.com/convert/20.10/');
    xhr.setRequestHeader('Authorization', 'Basic ' + btoa('adwitglobal' + ':' + '7b61297e35af1139edd33821adadd19e'));

    xhr.send(formData);
  }
}
