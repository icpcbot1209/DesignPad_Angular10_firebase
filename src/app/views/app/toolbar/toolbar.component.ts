import { Component, OnDestroy, OnInit } from '@angular/core';
import { Colors } from 'src/app/constants/colors.service';
import { ItemStatus, ItemType } from 'src/app/models/enums';
import { DesignService } from 'src/app/services/design.service';
import { MoveableService } from 'src/app/services/moveable.service';

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

  selectedFileType = 'PDF';
  fileTypeItems = [];

  ngOnInit(): void {
    this.fileTypeItems = ['PDF', 'JPG'];
  }

  downloadToPdf() {
    let xhr = new XMLHttpRequest();
    let formData = new FormData();

    let ele = document.querySelectorAll('.card')[0].firstChild as HTMLElement;

    let width = ele.clientWidth;
    let height = ele.clientHeight;

    document.querySelectorAll('.ql-editor').forEach((ele) => {
      if (ele.parentElement.children[2]) {
        ele.parentElement.children[2].remove();
      }
    });

    let htmlContent = document.querySelector('head').outerHTML + '<body style="margin: 0; padding: 0;>';
    let index = 0;

    document.querySelectorAll('.card').forEach((ele) => {
      ele.querySelectorAll('p').forEach((el) => {
        el.style.margin = '0';
      });
      // ele.querySelectorAll('span').forEach((el) => {
      //   el.style.background = 'red';

      //   let qlEditor = ele.querySelector('.ql-editor') as HTMLElement;
      //   el.style.lineHeight = qlEditor.style.lineHeight;
      // });

      let htmlStr = ele.children[0].children[0].outerHTML;

      htmlStr =
        `<div style="width: 600px; height: 500px; position: absolute; top: ${500 * index}px">` +
        htmlStr +
        // ele.querySelector('#curveText-0-0').parentElement.outerHTML +
        '</div>';

      console.log(htmlStr);
      index++;
      htmlContent += htmlStr;
    });

    htmlContent += '</body>';

    formData.append('text', htmlContent);

    if (this.selectedFileType == 'JPG') {
      // let htmlContent = [];

      // document.querySelectorAll('.card').forEach(() => {
      //   let htmlStr = ele.outerHTML;
      //   if (htmlStr.indexOf('<div class="ql-editor"')) {
      //     htmlStr =
      //       document.querySelector('head').outerHTML +
      //       htmlStr.slice(0, htmlStr.indexOf('<div class="ql-editor"')) +
      //       htmlStr.slice(htmlStr.indexOf('<p>'), htmlStr.length);
      //   }

      //   console.log(htmlStr);
      //   htmlContent.push(htmlStr);
      // });

      // formData.append('text', htmlContent[0]);
      formData.append('screenshot_width', width.toString());
      formData.append('screenshot_height', height.toString());
      formData.append('output_format', 'jpg');

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
          link.download = '1.jpg';
          link.click();
        };
        fr.readAsText(blob);
      };

      xhr.open('POST', 'https://api.pdfcrowd.com/convert/20.10/');
      xhr.setRequestHeader('Authorization', 'Basic ' + btoa('adwitglobal' + ':' + '7b61297e35af1139edd33821adadd19e'));
      // xhr.setRequestHeader('Authorization', 'Basic ' + btoa('demo' + ':' + 'ce544b6ea52a5621fb9d55f8b542d14d'));

      xhr.send(formData);
    } else {
      formData.append('page_width', width + 'px');
      formData.append('page_height', height + 'px');
      formData.append('no_margins', 'True');

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

  showDownloadContent() {
    this.moveableService.isShowDownload = !this.moveableService.isShowDownload;
  }

  changeFileType(event) {
    this.selectedFileType = event;
  }
}
