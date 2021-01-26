import { Component, OnInit } from '@angular/core';
import { MoveableService } from 'src/app/services/moveable.service';

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

  constructor(public moveableService: MoveableService) {}

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
      this.setShadowEffect();
      document.querySelector<HTMLElement>('#lift').style.display = 'block';
      this.setEffectSelector('#selector-lift');
    }
    if (method == 'hallow') {
      this.editorEle = document.querySelector<HTMLElement>(
        '#textEditor-' + this.moveableService.selectedPageId + '-' + this.moveableService.selectedItemId
      );
      this.editorEle.style.color = 'white';
      this.outlineColor = 'black';

      this.setHollowEffect();
      document.querySelector<HTMLElement>('#hallow').style.display = 'block';
      this.setEffectSelector('#selector-hallow');
    }
    if (method == 'splice') {
      this.thickness = 50;
      this.offset = 50;
      this.angle = -45;
      this.shadowColor = '#808080';
      this.outlineColor = 'black';

      document.querySelector<HTMLElement>('#splice').style.display = 'block';
      this.setEffectSelector('#selector-splice');

      this.editorEle = document.querySelector<HTMLElement>(
        '#textEditor-' + this.moveableService.selectedPageId + '-' + this.moveableService.selectedItemId
      );
      this.editorEle.style.color = 'white';
      this.setShadowEffect();
      this.setHollowEffect();
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

  onInputColorChange(effect) {
    let result;

    if (effect == 'shadow') {
      result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(this.shadowColor);
      this.shadowR = parseInt(result[1], 16);
      this.shadowG = parseInt(result[2], 16);
      this.shadowB = parseInt(result[3], 16);
    }
    if (effect == 'hollow') {
      result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(this.outlineColor);

      this.outlineR = parseInt(result[1], 16);
      this.outlineG = parseInt(result[2], 16);
      this.outlineB = parseInt(result[3], 16);
    }

    if (effect == 'shadow') {
      this.setShadowEffect();
      console.log('shadow');
    }
    if ((effect = 'hollow')) {
      this.setHollowEffect();
      console.log('hollow');
    }
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
}
