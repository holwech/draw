import Timer from '../timer/Timer';
import { PlayStates } from './playInterfaces';
import { IEvent } from '../utils/boardInterfaces';

export default class PlayState {
  constructor(
    public timer: Timer,
    public log: IEvent[] = [],
    public currIdx = 0,
    public state = PlayStates.PAUSE,
  ) {}
}