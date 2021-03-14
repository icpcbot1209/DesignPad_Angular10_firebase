import { Injectable, Injector } from '@angular/core';
import { Item } from '../models/models';
import { DesignService } from 'src/app/services/design.service';
import { UndoRedoService } from 'src/app/services/undo-redo.service';
import ArcText from 'arc-text';
import { MoveableService } from './moveable.service';
import { ItemsList } from '@ng-select/ng-select/lib/items-list';

declare var Quill;

@Injectable({
  providedIn: 'root',
})
export class ToolbarService {
  url = 'https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyBipcG_GYuR_AN_TP6SxzppJz9sWZxIJSQ';

  textEditItems = [];
  isCreateQuill: boolean = false;

  angel;
  direction;
  quillData;

  constructor(public ds: DesignService, private injector: Injector) {
    this.textEditItems.push([]);
  }

  quill;

  createTextEditor(selectedPageId, selectedItemId, item) {
    this.quill = new Quill('#textEditor-' + selectedPageId + '-' + selectedItemId, {
      modules: {
        toolbar: '#toolbar',
      },
      theme: 'snow',
    });
    this.quill.on('selection-change', (range, range2) => {
      if (range && range2 === null) {
        this.ds.isOnInput = true;
      }
    });

    const ds = this.injector.get(DesignService);
    const ur = this.injector.get(UndoRedoService);

    this.quill.on('text-change', function (delta, oldDelta, source) {
      this.quillData = document.querySelector('#textEditor-' + selectedPageId + '-' + selectedItemId).querySelector('.ql-editor');
      ds.theDesign.pages[selectedPageId].items[selectedItemId].quillData = this.quillData.outerHTML;
      console.log('text change');
      ur.saveTheData(ds.theDesign);
    });

    (document.querySelector('#textEditor-' + selectedPageId + '-' + selectedItemId).querySelector('.ql-editor') as HTMLElement).style.overflow =
      'hidden';

    if (this.isCreateQuill) {
      if (this.textEditItems[selectedPageId].length > selectedItemId) {
        this.textEditItems[selectedPageId][selectedItemId] = this.quill;
        this.isCreateQuill = false;
      } else {
        this.textEditItems[selectedPageId].push(this.quill);
        this.isCreateQuill = false;
      }
    }
  }

  resetting(item: Item) {
    let ele = document.querySelector<HTMLInputElement>('#fontSizeInput');
    if (ele) {
      ele.value = (Math.floor(Number.parseFloat(item.fontSize.substr(0, item.fontSize.length - 2)) * 10) / 10).toString();
    }
  }

  setCurveEffect(selectedPageId, selectedItemId, curveValue) {
    if (curveValue < 0) {
      this.direction = -1;
    } else this.direction = 1;
    if (curveValue == 0) {
      this.angel = 20000;
    } else {
      this.angel = (5000 / curveValue) * this.direction;
    }

    const moveableService = this.injector.get(MoveableService);
    let editorEle = document.querySelector<HTMLElement>('#textEditor-' + selectedPageId + '-' + selectedItemId);
    let curveText = document.querySelector<HTMLElement>('#curveText-' + selectedPageId + '-' + selectedItemId);
    let item = moveableService.getItem(editorEle);

    curveText.innerHTML = editorEle.children[0].children[0].innerHTML;
    curveText.style.fontSize = editorEle.style.fontSize;
    curveText.style.fontFamily = editorEle.style.fontFamily;
    curveText.style.opacity = '1';
    editorEle.setAttribute('Curve', 'true');
    item.isCurve = true;
    editorEle.style.opacity = '0';

    let arcText = new ArcText(curveText);

    arcText.arc(this.angel);
    arcText.direction(this.direction);

    this.setEffectToCurve(editorEle, curveText);

    curveText.querySelectorAll('span').forEach((ele) => {
      let qlEditor = editorEle.children[0] as HTMLElement;
      ele.style.lineHeight = qlEditor.style.lineHeight;
    });

    let curveTextStr;

    setTimeout(() => {
      curveTextStr = document.querySelector('#curveText-' + moveableService.selectedPageId + '-' + moveableService.selectedItemId).innerHTML;
      this.ds.theDesign.pages[moveableService.selectedPageId].items[moveableService.selectedItemId].textOpacity = '0';
      this.ds.theDesign.pages[moveableService.selectedPageId].items[moveableService.selectedItemId].curveOpacity = '1';
      this.ds.theDesign.pages[moveableService.selectedPageId].items[moveableService.selectedItemId].curveText = curveTextStr;
    });
  }

  setEffectToCurve(editorEle, curveText) {
    if (editorEle.children[0].children[0].children.length > 0) {
      let text = editorEle.children[0].children[0].innerHTML;
      let ele = [];
      let index = 0;
      let length = 0;
      let fromIndex = 0;

      for (let i = 0; i < editorEle.children[0].children[0].children.length; i++) {
        ele.push(editorEle.children[0].children[0].children[i]);
      }

      for (let j = 0; j < ele.length; j++) {
        index = index + length + text.indexOf(ele[j].outerHTML, fromIndex) - fromIndex;
        length = ele[j].innerHTML.length;

        for (let i = index; i < index + length; i++) {
          let textEle = curveText.children[0].children[i] as HTMLElement;
          textEle.style.color = ele[j].style.color;
        }

        if (ele[j].outerHTML.indexOf('<strong') >= 0 && ele[j].outerHTML.indexOf('</strong>') >= 0) {
          for (let i = index; i < index + length; i++) {
            let textEle = curveText.children[0].children[i] as HTMLElement;
            textEle.style.fontWeight = 'bold';
          }
        }

        fromIndex = text.indexOf(ele[j].outerHTML, fromIndex) + ele[j].outerHTML.length;
      }
    }
  }
}
