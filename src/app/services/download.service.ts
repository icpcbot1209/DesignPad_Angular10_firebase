import { HttpClient, XhrFactory, HttpXhrBackend } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { DesignService } from 'src/app/services/design.service';
import { saveAs } from 'file-saver';

declare let JSZip;

@Injectable({
  providedIn: 'root',
})
export class DownloadService {
  ds = this.injector.get(DesignService);
  onDownloading: boolean;

  constructor(private http: HttpClient, public injector: Injector) {}

  download(selectedFileType) {
    if (selectedFileType == 'PDF') this.downloadAsPdf();
    else this.downloadAsImg();
  }

  downloadAsPdf() {
    let xhr = new XMLHttpRequest();
    let formData = new FormData();
    let width = this.ds.theDesign.category.size.x;
    let height = this.ds.theDesign.category.size.y;
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
      let blob = xhr.response;

      let fr = new FileReader();
      fr.onload = (result) => {
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
          window.navigator.msSaveOrOpenBlob(blob);
          return;
        }
        const url = window.URL.createObjectURL(blob);
        let link = document.createElement('a');
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

  async downloadAsImg() {
    let zip = new JSZip();
    this.onDownloading = true;

    document.querySelectorAll('.ql-editor').forEach((ele) => {
      if (ele.parentElement.children[2]) {
        ele.parentElement.children[2].remove();
      }
    });

    const arr = document.querySelectorAll('.card');
    for (let i = 0; i < arr.length; i++) {
      console.log('start ', i);
      let ele = arr[i];
      if (ele.querySelectorAll('p').length != 0) {
        ele.querySelectorAll('p').forEach((el) => {
          el.style.margin = '0';
        });
      }

      let htmlContent = document.querySelector('head').outerHTML + '<body style="margin: 0; padding: 0;>';
      let htmlStr = ele.children[0].children[0].outerHTML;

      htmlStr = `<div style="width: 600px; height: 500px; position: absolute;">` + htmlStr + '</div>';
      htmlContent = htmlContent + htmlStr + '</body>';

      const blob = await this.downloadOnePageAsImg(htmlContent, i);
      console.log(blob);
      // zip.file(i + 1 + '.jpg', blob);
      saveAs(blob, i + 1 + '.jpg');
    }

    this.onDownloading = false;
    // zip.generateAsync({ type: 'blob' }).then(function (content) {
    //   saveAs(content, 'image.zip');
    // });
  }

  downloadOnePageAsImg(htmlContent, index) {
    return new Promise((resolve, reject) => {
      let xhr = new XMLHttpRequest();
      xhr.responseType = 'blob';
      let formData = new FormData();

      formData.append('text', htmlContent);
      formData.append('screenshot_width', this.ds.theDesign.category.size.x.toString());
      formData.append('screenshot_height', this.ds.theDesign.category.size.y.toString());
      formData.append('output_format', 'jpg');

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(xhr.response);
        } else {
          reject(xhr.statusText);
        }
      };

      xhr.open('POST', 'https://api.pdfcrowd.com/convert/20.10/', true);
      xhr.setRequestHeader('Authorization', 'Basic ' + btoa('adwitglobal' + ':' + '7b61297e35af1139edd33821adadd19e'));
      xhr.send(formData);
    });
  }
}
