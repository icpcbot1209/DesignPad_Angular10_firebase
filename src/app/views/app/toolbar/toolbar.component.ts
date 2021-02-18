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
      if (ele.querySelectorAll('p').length != 0) {
        ele.querySelectorAll('p').forEach((el) => {
          el.style.margin = '0';
        });
      }

      let htmlStr = ele.children[0].children[0].outerHTML;

      htmlStr = `<div style="width: 600px; height: 500px; position: absolute; top: ${500 * index}px">` + htmlStr + '</div>';

      index++;
      htmlContent += htmlStr;
    });

    htmlContent += '</body>';

    formData.append('text', htmlContent);

    if (this.selectedFileType == 'JPG') {
      this.downloadAsImg();
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

  downloadOnePageAsImg(htmlContent: string) {
    let xhr = new XMLHttpRequest();
    let formData = new FormData();

    formData.append('text', htmlContent);
    formData.append('screenshot_width', '600');
    formData.append('screenshot_height', '500');
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
    xhr.send(formData);
  }

  downloadAsImg() {
    document.querySelectorAll('.ql-editor').forEach((ele) => {
      if (ele.parentElement.children[2]) {
        ele.parentElement.children[2].remove();
      }
    });

    document.querySelectorAll('.card').forEach(async (ele) => {
      let myPromise = new Promise(function (myResolve, myReject) {
        if (ele.querySelectorAll('p').length != 0) {
          ele.querySelectorAll('p').forEach((el) => {
            el.style.margin = '0';
          });
        }

        let htmlContent = document.querySelector('head').outerHTML + '<body style="margin: 0; padding: 0;>';
        let htmlStr = ele.children[0].children[0].outerHTML;

        htmlStr = `<div style="width: 600px; height: 500px; position: absolute;">` + htmlStr + '</div>';

        htmlContent = htmlContent + htmlStr + '</body>';

        let xhr = new XMLHttpRequest();
        let formData = new FormData();

        formData.append('text', htmlContent);
        formData.append('screenshot_width', '600');
        formData.append('screenshot_height', '500');
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
        xhr.send(formData);
      });
      await myPromise;
    });
  }

  showDownloadContent() {
    this.moveableService.isShowDownload = !this.moveableService.isShowDownload;
  }

  changeFileType(event) {
    this.selectedFileType = event;
  }
}
