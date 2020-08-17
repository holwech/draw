import { EventType, SVG } from '../Interfaces/AppInterfaces';
import { IStrokePropOptions } from '../Interfaces/ActionInterfaces';
import { singleton } from 'tsyringe';
import Dispatcher from './Dispatcher';
import { EventOrigin } from '../Interfaces/BoardInterfaces';

@singleton()
export class MouseEventListenerController {
  // Event functions
  private isClick = true;
  private fnOnWheel: (e: WheelEvent) => void;

  private fnOnMouseDown: (e: MouseEvent) => void;
  private fnOnMouseUp: (e: MouseEvent) => void;
  private fnOnMouseMove: (e: MouseEvent) => void;
  private fnOnMouseLeave: (e: MouseEvent) => void;

  private svg!: SVG;

  constructor(private dispatcher: Dispatcher, svgElement: HTMLElement) {
    this.fnOnWheel = this.onWheel;

    this.fnOnMouseDown = this.onMouseDown;
    this.fnOnMouseUp = this.onMouseUp;
    this.fnOnMouseMove = this.onMouseMove;
    this.fnOnMouseLeave = this.onMouseLeave;
    this.svg = (svgElement as any) as SVG;
  }

  public addEventListeners(): void {
    this.svg.addEventListener('mousedown', this.fnOnMouseDown); // Pressing the mouse
    this.svg.addEventListener('wheel', this.fnOnWheel);
  }

  public removeEventListeners(): void {
    this.svg.removeEventListener('mousedown', this.fnOnMouseDown); // Pressing the mouse
    this.svg.removeEventListener('wheel', this.fnOnWheel);
  }

  private onWheel = (e: WheelEvent) => {
    e.preventDefault();
    this.dispatcher.dispatchEvent({ eventType: EventType.ONWHEEL, e }, EventOrigin.USER);
  };

  private onMouseDown = (e: MouseEvent) => {
    e.preventDefault();
    this.isClick = true;
    this.svg.removeEventListener('mousedown', this.fnOnMouseDown); // Pressing the mouse
    this.svg.addEventListener('mouseup', this.fnOnMouseUp); // Releasing the mouse
    this.svg.addEventListener('mouseleave', this.fnOnMouseLeave); // Releasing the mouse
    this.svg.addEventListener('mousemove', this.fnOnMouseMove);
  };

  private onMouseUp = (e: MouseEvent) => {
    e.preventDefault();
    if (this.isClick) {
      this.dispatcher.dispatchEvent({ eventType: EventType.CLICK, e }, EventOrigin.USER);
    } else {
      this.dispatcher.dispatchEvent({ eventType: EventType.POINTER_UP, e }, EventOrigin.USER);
    }
    this.isClick = false;
    this.svg.removeEventListener('mouseup', this.fnOnMouseUp); // Releasing the mouse
    this.svg.removeEventListener('mouseleave', this.fnOnMouseLeave); // Releasing the mouse
    this.svg.removeEventListener('mousemove', this.fnOnMouseMove);
    this.svg.addEventListener('mousedown', this.fnOnMouseDown); // Pressing the mouse
  };

  private onMouseLeave = (e: MouseEvent) => {
    e.preventDefault();
    if (this.isClick) {
      this.dispatcher.dispatchEvent({ eventType: EventType.CLICK, e }, EventOrigin.USER);
    } else {
      this.dispatcher.dispatchEvent({ eventType: EventType.POINTER_UP, e }, EventOrigin.USER);
    }
    this.isClick = false;
    this.svg.removeEventListener('mouseup', this.fnOnMouseUp); // Releasing the mouse
    this.svg.removeEventListener('mouseleave', this.fnOnMouseLeave); // Releasing the mouse
    this.svg.removeEventListener('mousemove', this.fnOnMouseMove);
    this.svg.addEventListener('mousedown', this.fnOnMouseDown); // Pressing the mouse
  };

  private onMouseMove = (e: MouseEvent) => {
    e.preventDefault();

    if (this.isClick) {
      this.dispatcher.dispatchEvent({ eventType: EventType.POINTER_DOWN, e }, EventOrigin.USER);
      this.isClick = false;
    }
    this.dispatcher.dispatchEvent({ eventType: EventType.POINTER_MOVE, e }, EventOrigin.USER);
  };
}