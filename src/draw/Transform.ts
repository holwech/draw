interface Point {
  x: number;
  y: number;
}

export class Transform {
  public scale = 1;
  public scaleSpeed = 1;
  private svg: SVGElement & SVGElement & SVGSVGElement;
  private isPointerDown = false;
  private pointerOrigin: Point = { x: 0, y: 0 };
  private viewBox = { x: 0, y: 0, width: 500, height: 500 };
  private newViewBox = { x: 0, y: 0 };
  constructor(svgID: string) {
    this.svg = document.getElementById(svgID) as any as SVGElement & SVGSVGElement & HTMLElement;
    const viewboxElem = this.svg.getAttributeNS(null, 'viewBox');
    if (viewboxElem !== null) {
      const arr = viewboxElem.split(' ').map(Number);
      this.viewBox = { x: arr[0], y: arr[1], width: arr[2], height: arr[3] };
    } else {
      throw new Error('The SVG element requires the view box attribute to be set.');
    }
  }

  public onWheel(e: WheelEvent) {
    const mousePosition = this.getPointFromViewBox(e);
    this.viewBox.x = mousePosition.x + (this.viewBox.x - mousePosition.x) * this.scale;
    this.viewBox.y = mousePosition.y + (this.viewBox.y - mousePosition.y) * this.scale;
    this.viewBox.width = this.viewBox.width * this.scale;
    this.viewBox.height = this.viewBox.height * this.scale;
    const viewBoxString = `${this.viewBox.x} ${this.viewBox.y} ${this.viewBox.width} ${this.viewBox.height}`;
    this.scale *= this.scale;
    this.svg.setAttribute('viewBox', viewBoxString);
  }

  public onPointerDown(e: TouchEvent | MouseEvent) {
    this.isPointerDown = true;
    this.pointerOrigin = this.getPointFromViewBox(e);
  }

  public onPointerUp() {
    this.isPointerDown = false;
  }

  public onPointerMove(e: TouchEvent | MouseEvent | WheelEvent) {
    if (!this.isPointerDown) {
      return;
    }
    e.preventDefault();

    const pointerPosition = this.getPointFromViewBox(e);
    this.newViewBox.x = this.viewBox.x - (pointerPosition.x - this.pointerOrigin.x) * this.scale;
    this.newViewBox.y = this.viewBox.y - (pointerPosition.y - this.pointerOrigin.y) * this.scale;
    const viewBoxString = `${this.newViewBox.x} ${this.newViewBox.y} ${this.viewBox.width} ${this.viewBox.height}`;
    this.svg.setAttribute('viewBox', viewBoxString);
    this.viewBox.x = this.newViewBox.x;
    this.viewBox.y = this.newViewBox.y;
  }

  private getPointFromViewBox(e: TouchEvent | MouseEvent | WheelEvent) {
    const m = this.svg.getScreenCTM();
    const point = this.svg.createSVGPoint();

    if ((window as any).TouchEvent && e instanceof TouchEvent) {
      point.x = e.targetTouches[0].clientX;
      point.y = e.targetTouches[0].clientY;
    } else if (e instanceof MouseEvent || e instanceof WheelEvent) {
      point.x = e.clientX;
      point.y = e.clientY;
    }
    if (m) {
      return point.matrixTransform(m.inverse());
    } else {
      throw new Error('m variable is not defined in getPointFromViewBox in Transform');
    }
  }
}
