import { Component, OnInit } from '@angular/core';
import { MoveableService } from 'src/app/services/moveable.service';
import { ToolbarService } from 'src/app/services/toolbar.service';

@Component({
  selector: 'toolpanel-text-effects',
  templateUrl: './text-effects.component.html',
  styleUrls: ['./text-effects.component.scss'],
})
export class TextEffectsComponent implements OnInit {
  editorEle;
  fontSize;
  step = 1;
  value = 0;

  /* Shadow */

  offset = 50;
  offsetX;
  offsetY;
  blurSize;
  blur = 0;
  angle = -45;
  directionX = 0;
  directionY = 1;

  shadowColor;
  outlineColor;

  shadowR: number = 0;
  shadowG: number = 0;
  shadowB: number = 0;
  outlineR: number = 0;
  outlineG: number = 0;
  outlineB: number = 0;

  opacity = 40;
  intensity = 50;

  thickness = 50;

  glitchColorA = 'rgb(0, 255, 255)';
  glitchColorB = 'rgb(255, 0, 255)';

  neonValue;
  curveValue;

  constructor(public moveableService: MoveableService, public toolbarService: ToolbarService) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.setEffectSelector('#selector-none');
  }
  ngOnDestroy(): void {
    document.querySelector<HTMLElement>('#sub-menu').style.backgroundColor = '#293039';
  }

  setTextEffect(method: string) {
    document.querySelectorAll<HTMLElement>('.effectContent').forEach((ele) => {
      if (ele.style.display == 'block') {
        ele.style.display = 'none';
      }
    });
    document.querySelectorAll<HTMLElement>('.effectSelector').forEach((ele) => {
      ele = ele.firstElementChild as HTMLElement;
      if (ele.style.borderColor == 'rgb(109, 47, 165)') {
        ele.style.borderColor = 'rgba(118, 118, 118, 0.3)';
      }
    });
    if (method == 'none') {
      document.querySelector<HTMLElement>('#selector-none').style.borderColor = 'rgb(109, 47, 165)';
      this.setEffectSelector('#selector-none');
    }
    if (method == 'shadow') {
      this.shadowColor = '#808080';
      this.setShadowEffect();
      document.querySelector<HTMLElement>('#shadow').style.display = 'block';
      this.setEffectSelector('#selector-shadow');
    }
    if (method == 'lift') {
      this.shadowColor = '#808080';
      this.setShadowEffect();
      document.querySelector<HTMLElement>('#lift').style.display = 'block';
      this.setEffectSelector('#selector-lift');
    }
    if (method == 'hallow') {
      this.editorEle = document.querySelector<HTMLElement>(
        '#textEditor-' + this.moveableService.selectedPageId + '-' + this.moveableService.selectedItemId
      );
      this.editorEle.style.color = 'white';
      this.outlineColor = '#000000';

      this.setHollowEffect();
      document.querySelector<HTMLElement>('#hallow').style.display = 'block';
      this.setEffectSelector('#selector-hallow');
    }
    if (method == 'splice') {
      this.thickness = 50;
      this.offset = 50;
      this.angle = -45;
      this.shadowColor = '#808080';
      this.outlineColor = '#000000';

      this.onInputShadowColorChange();
      this.onInputHollowColorChange();

      document.querySelector<HTMLElement>('#splice').style.display = 'block';
      this.setEffectSelector('#selector-splice');

      this.editorEle = document.querySelector<HTMLElement>(
        '#textEditor-' + this.moveableService.selectedPageId + '-' + this.moveableService.selectedItemId
      );
      this.editorEle.style.color = 'white';
      this.setShadowEffect();
      this.setHollowEffect();
    }
    if (method == 'echo') {
      this.editorEle = document.querySelector<HTMLElement>(
        '#textEditor-' + this.moveableService.selectedPageId + '-' + this.moveableService.selectedItemId
      );
      this.shadowColor = '#000000';
      this.offset = 50;
      this.angle = -45;
      this.blurSize = 0;

      this.setMultiShadowEffect();
      document.querySelector<HTMLElement>('#echo').style.display = 'block';
      this.setEffectSelector('#selector-echo');
    }
    if (method == 'glitch') {
      this.editorEle = document.querySelector<HTMLElement>(
        '#textEditor-' + this.moveableService.selectedPageId + '-' + this.moveableService.selectedItemId
      );
      this.shadowColor = '#000000';
      this.offset = 30;
      this.blurSize = 0;
      this.angle = 90;
      this.directionX = Math.sin((this.angle * Math.PI) / 180);
      this.directionY = Math.cos((this.angle * Math.PI) / 180);

      this.setGlitchEffect();
      document.querySelector<HTMLElement>('#glitch').style.display = 'block';
      this.setEffectSelector('#selector-glitch');
    }
    if (method == 'neon') {
      this.editorEle = document.querySelector<HTMLElement>(
        '#textEditor-' + this.moveableService.selectedPageId + '-' + this.moveableService.selectedItemId
      );
      this.shadowColor = '#000000';
      this.blurSize = 50;
      this.neonValue = 50;

      this.editorEle = document.querySelector<HTMLElement>(
        '#textEditor-' + this.moveableService.selectedPageId + '-' + this.moveableService.selectedItemId
      );
      this.editorEle.style.color = 'rgb(0, 0, 0)';

      this.onInputShadowColorChange();

      this.setNeonEffect();
      document.querySelector<HTMLElement>('#neon').style.display = 'block';
      this.setEffectSelector('#selector-neon');
    }
    if (method == 'curve') {
      this.setCurveEffect();

      // document.querySelector<HTMLElement>('#curve').style.display = 'block';
      this.setEffectSelector('#selector-curve');
    }
  }

  setEffectSelector(id) {
    let ele = document.querySelector<HTMLElement>(id).firstElementChild as HTMLElement;
    ele.style.borderColor = 'rgb(109, 47, 165)';
  }

  setShadowEffect() {
    this.editorEle = document.querySelector<HTMLElement>(
      '#textEditor-' + this.moveableService.selectedPageId + '-' + this.moveableService.selectedItemId
    );
    this.fontSize = this.editorEle.style.fontSize;

    this.offsetX = ((parseFloat(this.fontSize) / (100 / this.offset) / 6) * this.directionX).toString() + 'px';
    this.offsetY = ((parseFloat(this.fontSize) / (100 / this.offset) / 6) * this.directionY).toString() + 'px';
    this.blurSize = (parseFloat(this.fontSize) / (100 / this.blur) / 6).toString() + 'px';

    let op = this.opacity / 100;

    this.editorEle.style.textShadow =
      'rgba(' + this.shadowR + ', ' + this.shadowG + ', ' + this.shadowB + ', ' + op + ') ' + this.offsetX + ' ' + this.offsetY + ' ' + this.blurSize;
  }

  // shadow

  onInputOffsetChange(event) {
    this.offset = event.value;

    this.setShadowEffect();
  }

  onInputBlurChange(event) {
    this.blur = event.value;

    this.setShadowEffect();
  }

  onInputDirectionChange(event) {
    this.angle = event.value;
    this.directionX = Math.sin((this.angle * Math.PI) / 180);
    this.directionY = Math.cos((this.angle * Math.PI) / 180);

    this.setShadowEffect();
  }

  onInputShadowColorChange() {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(this.shadowColor);

    this.shadowR = parseInt(result[1], 16);
    this.shadowG = parseInt(result[2], 16);
    this.shadowB = parseInt(result[3], 16);

    this.setShadowEffect();
  }

  onInputHollowColorChange() {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(this.outlineColor);

    this.outlineR = parseInt(result[1], 16);
    this.outlineG = parseInt(result[2], 16);
    this.outlineB = parseInt(result[3], 16);

    this.setHollowEffect();
  }

  onInputOpacityChange(event) {
    this.opacity = event.value;

    this.setShadowEffect();
  }

  onInputLiftChange(event) {
    this.intensity = event.value;
    this.blur = event.value;

    this.setShadowEffect();
  }

  // Splic
  setHollowEffect() {
    this.editorEle = document.querySelector<HTMLElement>(
      '#textEditor-' + this.moveableService.selectedPageId + '-' + this.moveableService.selectedItemId
    );
    this.fontSize = this.editorEle.style.fontSize;
    this.editorEle.style.webkitTextStroke =
      ((parseFloat(this.fontSize) * this.thickness) / 100 / 14.54).toString() +
      'px rgb(' +
      this.outlineR +
      ', ' +
      this.outlineG +
      ', ' +
      this.outlineB +
      ')';
  }

  onInputThicknessChange(event) {
    this.thickness = event.value;

    this.setHollowEffect();
  }

  // Echo
  setMultiShadowEffect() {
    this.editorEle = document.querySelector<HTMLElement>(
      '#textEditor-' + this.moveableService.selectedPageId + '-' + this.moveableService.selectedItemId
    );
    this.fontSize = this.editorEle.style.fontSize;

    this.offsetX = ((parseFloat(this.fontSize) / (100 / this.offset) / 6) * this.directionX).toString() + 'px';
    this.offsetY = ((parseFloat(this.fontSize) / (100 / this.offset) / 6) * this.directionY).toString() + 'px';
    let offset2X = ((parseFloat(this.fontSize) / (100 / this.offset) / 6) * this.directionX * 2).toString() + 'px';
    let offset2Y = ((parseFloat(this.fontSize) / (100 / this.offset) / 6) * this.directionY * 2).toString() + 'px';
    this.blurSize = (parseFloat(this.fontSize) / (100 / this.blur) / 6).toString() + 'px';

    this.editorEle.style.textShadow =
      'rgba(' +
      this.shadowR +
      ', ' +
      this.shadowG +
      ', ' +
      this.shadowB +
      ', ' +
      0.5 +
      ') ' +
      this.offsetX +
      ' ' +
      this.offsetY +
      ' ' +
      this.blurSize +
      ', ' +
      'rgba(' +
      this.shadowR +
      ', ' +
      this.shadowG +
      ', ' +
      this.shadowB +
      ', ' +
      0.3 +
      ') ' +
      offset2X +
      ' ' +
      offset2Y +
      ' ' +
      this.blurSize;
  }

  onInputMultiOffsetChange(event) {
    this.offset = event.value;

    this.setMultiShadowEffect();
  }

  onInputMultiDirectionChange(event) {
    this.angle = event.value;
    this.directionX = Math.sin((this.angle * Math.PI) / 180);
    this.directionY = Math.cos((this.angle * Math.PI) / 180);

    this.setMultiShadowEffect();
  }

  onInputMultiShadowColorChange() {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(this.shadowColor);

    this.shadowR = parseInt(result[1], 16);
    this.shadowG = parseInt(result[2], 16);
    this.shadowB = parseInt(result[3], 16);

    this.setMultiShadowEffect();
  }

  // Glitch
  setGlitchEffect() {
    this.editorEle = document.querySelector<HTMLElement>(
      '#textEditor-' + this.moveableService.selectedPageId + '-' + this.moveableService.selectedItemId
    );
    this.fontSize = this.editorEle.style.fontSize;

    this.offsetX = ((parseFloat(this.fontSize) / (100 / this.offset) / 6) * this.directionX).toString() + 'px';
    this.offsetY = ((parseFloat(this.fontSize) / (100 / this.offset) / 6) * this.directionY).toString() + 'px';
    let offset2X = (((-1 * parseFloat(this.fontSize)) / (100 / this.offset) / 6) * this.directionX).toString() + 'px';
    let offset2Y = (((-1 * parseFloat(this.fontSize)) / (100 / this.offset) / 6) * this.directionY).toString() + 'px';
    this.blurSize = (parseFloat(this.fontSize) / (100 / this.blur) / 6).toString() + 'px';

    this.editorEle.style.textShadow =
      this.glitchColorA +
      ' ' +
      this.offsetX +
      ' ' +
      this.offsetY +
      ' ' +
      this.blurSize +
      ', ' +
      this.glitchColorB +
      ' ' +
      offset2X +
      ' ' +
      offset2Y +
      ' ' +
      this.blurSize;
  }

  onInputGlitchOffsetChange(event) {
    this.offset = event.value;

    this.setGlitchEffect();
  }

  onInputGlitchDirectionChange(event) {
    this.angle = event.value;
    this.directionX = Math.sin((this.angle * Math.PI) / 180);
    this.directionY = Math.cos((this.angle * Math.PI) / 180);

    this.setGlitchEffect();
  }

  onInputGlitchChange_A() {
    this.glitchColorA = 'rgb(0, 255, 255)';
    this.glitchColorB = 'rgb(255, 0, 255)';

    this.setGlitchEffect();
  }

  onInputGlitchChange_B() {
    this.glitchColorA = 'rgb(0, 255, 255)';
    this.glitchColorB = 'rgb(255, 0, 0)';

    this.setGlitchEffect();
  }

  // Neon

  setNeonEffect() {
    this.editorEle = document.querySelector<HTMLElement>(
      '#textEditor-' + this.moveableService.selectedPageId + '-' + this.moveableService.selectedItemId
    );
    this.fontSize = this.editorEle.style.fontSize;

    this.offsetX = 1;
    this.offsetY = 1;
    this.blurSize = (parseFloat(this.fontSize) / (100 / this.blur) / 6).toString() + 'px';
    let blur = parseFloat(this.fontSize) / 100 / 6;

    let op = 1;

    let R = this.shadowR + ((255 - this.shadowR) * (this.neonValue - 1)) / 100;
    let G = this.shadowG + ((255 - this.shadowG) * (this.neonValue - 1)) / 100;
    let B = this.shadowB + ((255 - this.shadowB) * (this.neonValue - 1)) / 100;
    console.log(R, G, B);

    this.editorEle.style.textShadow =
      'rgba(' +
      this.shadowR +
      ', ' +
      this.shadowG +
      ', ' +
      this.shadowB +
      ', ' +
      op +
      ') ' +
      this.offsetX +
      'px' +
      ' ' +
      this.offsetY +
      'px' +
      ' ' +
      blur * 10 * 6 +
      'px, ' +
      'rgba(' +
      this.shadowR +
      ', ' +
      this.shadowG +
      ', ' +
      this.shadowB +
      ', ' +
      op +
      ') ' +
      this.offsetX +
      'px' +
      ' ' +
      this.offsetY +
      'px' +
      ' ' +
      blur * 10 * 8 +
      'px, ' +
      'rgba(' +
      this.shadowR +
      ', ' +
      this.shadowG +
      ', ' +
      this.shadowB +
      ', ' +
      op +
      ') ' +
      this.offsetX +
      'px' +
      ' ' +
      this.offsetY +
      'px' +
      ' ' +
      blur * 10 * 12 +
      'px';

    this.editorEle.style.color = 'rgb(' + R + ', ' + G + ', ' + B + ')';
  }

  onInputNeonChange(event) {
    this.neonValue = event.value;
    this.setNeonEffect();
  }

  onInputNeonColorChange() {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(this.shadowColor);

    this.shadowR = parseInt(result[1], 16);
    this.shadowG = parseInt(result[2], 16);
    this.shadowB = parseInt(result[3], 16);

    this.setNeonEffect();
  }

  // curve

  setCurveEffect() {
    // console.log(this.moveableService.selectedPageId, this.moveableService.selectedItemId);
    // let quill = this.toolbarService.textEditItems[this.moveableService.selectedPageId][this.moveableService.selectedItemId];

    // let editorEle = document.querySelector<HTMLElement>(
    //   '#textEditor-' + this.moveableService.selectedPageId + '-' + this.moveableService.selectedItemId
    // );
    // let curveText = document.querySelector<HTMLElement>(
    //   '#curveText-' + this.moveableService.selectedPageId + '-' + this.moveableService.selectedItemId
    // );

    // // curveText.innerHTML = quill.getText();
    // curveText.innerHTML = quill.container.innerHTML;
    // curveText.style.fontSize = editorEle.style.fontSize;
    // curveText.style.fontFamily = editorEle.style.fontFamily;
    // curveText.style.opacity = '1';

    // editorEle.setAttribute('Curve', 'true');
    // editorEle.style.opacity = '0';

    this.toolbarService.setCurveEffect(this.moveableService.selectedPageId, this.moveableService.selectedItemId);
  }

  onInputCurveChange(event) {}
}
