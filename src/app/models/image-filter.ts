export class ImageFilterObj {
  brightness = 0;
  blur = 0;
  contrast = 0;
  grayscale = 0;
  hue = 0;
  invert = 0;
  saturate = 0;
  sepia = 0;

  str() {}

  css() {
    return (
      'blur(' +
      this.blur +
      'px)' +
      ' saturate(' +
      this.saturate +
      ')' +
      ' contrast(' +
      this.contrast +
      ')' +
      ' invert(' +
      this.invert +
      ')' +
      ' sepia(' +
      this.sepia +
      ')' +
      ' grayscale(' +
      this.grayscale +
      ')' +
      ' brightness(' +
      this.brightness +
      ')' +
      ' hue-rotate(' +
      this.hue +
      'deg)'
    );
  }
}
