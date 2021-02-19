import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DownloadService {
  onDownloading: boolean;

  constructor() {}

  download(selectedFileType) {
    if (selectedFileType == 'PDF') this.downloadAsPdf();
    else this.downloadAsImg();
  }

  downloadAsPdf() {
    let xhr = new XMLHttpRequest();
    let formData = new FormData();
    let width = 600;
    let height = 500;
    this.onDownloading = true;

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

        this.onDownloading = false;
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
      if (ele.querySelectorAll('p').length != 0) {
        ele.querySelectorAll('p').forEach((el) => {
          el.style.margin = '0';
        });
      }

      let htmlContent = document.querySelector('head').outerHTML + '<body style="margin: 0; padding: 0;>';
      let htmlStr = ele.children[0].children[0].outerHTML;

      htmlStr = `<div style="width: 600px; height: 500px; position: absolute;">` + htmlStr + '</div>';
      htmlContent = htmlContent + htmlStr + '</body>';

      this.downloadOnePageAsImg(htmlContent);
    });
  }

  downloadOnePageAsImg(htmlContent) {
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
}
