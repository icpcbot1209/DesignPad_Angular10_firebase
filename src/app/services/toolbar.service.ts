import { Injectable } from '@angular/core';
import { Item } from '../models/models';
import ArcText from 'arc-text';

declare var Quill;

@Injectable({
  providedIn: 'root',
})
export class ToolbarService {
  url = 'https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyBipcG_GYuR_AN_TP6SxzppJz9sWZxIJSQ';

  textEditItems = [];
  isCreateQuill: boolean = false;

  constructor() {
    this.textEditItems.push([]);
  }

  createTextEditor(selectedPageId, selectedItemId) {
    let quill = new Quill('#textEditor-' + selectedPageId + '-' + selectedItemId, {
      modules: {
        toolbar: '#toolbar',
      },
      theme: 'snow',
    });

    if (this.isCreateQuill) {
      if (this.textEditItems[selectedPageId].length > selectedItemId) {
        this.textEditItems[selectedPageId][selectedItemId] = quill;
        this.isCreateQuill = false;
      } else {
        this.textEditItems[selectedPageId].push(quill);
        this.isCreateQuill = false;
      }
    }

    console.log(this.textEditItems[selectedPageId].length, 'asdfasf');
  }

  resetting(item: Item) {
    let ele = document.querySelector<HTMLInputElement>('#fontSizeInput');
    if (ele) {
      ele.value = item.fontSize.substr(0, item.fontSize.length - 2);
    }
  }

  setCurveEffect(selectedPageId, selectedItemId) {
    let quill = this.textEditItems[selectedPageId][selectedItemId];
    // let quill = new Quill('#textEditor-' + selectedPageId + '-' + selectedItemId, {
    //   modules: {
    //     toolbar: '#toolbar',
    //   },
    //   theme: 'snow',
    // });

    console.log(quill);

    let editorEle = document.querySelector<HTMLElement>('#textEditor-' + selectedPageId + '-' + selectedItemId);
    let curveText = document.querySelector<HTMLElement>('#curveText-' + selectedPageId + '-' + selectedItemId);

    console.log(quill);
    console.log(selectedPageId, selectedItemId);

    curveText.innerHTML = quill.container.innerHTML;
    curveText.style.fontSize = editorEle.style.fontSize;
    curveText.style.fontFamily = editorEle.style.fontFamily;
    curveText.style.opacity = '1';
    editorEle.setAttribute('Curve', 'true');
    editorEle.style.opacity = '0';

    let arcText = new ArcText(curveText);
    arcText.arc(150);
  }
}
