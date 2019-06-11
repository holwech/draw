import { EventOrigin } from '../utils/boardInterfaces';
import { EventType } from '../utils/appInterfaces';
import { AppController } from '../AppController';
import { PlayStates } from './playInterfaces';
import PlayState from './PlayState';
import { UserActionType } from '../utils/appInterfaces';
import Timer from '../timer/Timer';
import { IAction, Targets } from '../action/ActionInterfaces';

export class PlayBaseController {
  constructor(protected app: AppController, protected timer: Timer, protected state: PlayState) {
    this.state.log = [];
  }

  public setEventLog(log: IAction[]): void {
    this.state.log = log;
  }

  public deleteEventLog(): void {
    this.state.log = [];
  }

  public restart(): void {
    this.app.action.commitAction({ target: Targets.CLEAR });
    this.state.currIdx = 0;
  }

  public playFromIndex(index: number): void {
    this.state.currIdx = index;
    this.playEvents();
  }

  public playFromTime(time: number): void {
    const log = this.state.log;
    if (log.length === 0) {
      return;
    }
    this.app.action.commitAction({ target: Targets.CLEAR });
    for (let i = 0; i <= log.length; i++) {
      if (log[i].time! >= time) {
        if (i === 0) {
          this.state.currIdx = 0;
        } else {
          this.state.currIdx = i - 1;
        }
        break;
      }
    }
    console.log('index is ' + this.state.currIdx + ' of ' + log.length);
    this.playEvents();
  }

  protected playEvents(): void {
    if (this.state.currIdx !== this.state.log.length) {
      setTimeout(() => {
        this.app.action.commitAction(this.state.log[this.state.currIdx]);
        this.state.currIdx++;
        this.playEvents();
      }, this.state.log[this.state.currIdx].time! - this.timer.getTime());
    } else {
      this.app.dispatchUserAction({ action: UserActionType.PAUSE });
    }
  }

  protected reversePlayEvents(): void {
    console.log('playing reverse');
    if (this.state.currIdx >= 0) {
      setTimeout(() => {
        if (this.state.state === PlayStates.REVERSE) {
          this.app.action.commitAction(this.state.log[this.state.currIdx]);
          this.state.currIdx--;
          this.reversePlayEvents();
        }
      }, this.timer.getTime() - this.state.log[this.state.currIdx].time!);
    } else {
      this.app.dispatchUserAction({ action: UserActionType.PAUSE });
    }
  }
}
