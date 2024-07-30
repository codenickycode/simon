import { Pad } from './pad';
import type { usePadController } from '../pad-controller';
import classNames from 'classnames';

interface PadsProps {
  isPlaying: boolean;
  isUserTurn: boolean;
  currentScore: number;
  padController: ReturnType<typeof usePadController>;
}

export const Pads = ({
  isPlaying,
  isUserTurn,
  currentScore,
  padController,
}: PadsProps) => {
  return (
    <div className="w-[320px] sm:w-[480px] lg:w-[720px] xl:w-[900px] max-w-[75dvh] aspect-square rounded-full bg-slate-900 border-8 border-slate-950 flex items-center justify-center">
      <div className="relative w-[95%] grid grid-cols-2 gap-1">
        <Pad
          padId="green"
          active={padController.activePads.has('green')}
          onPointerDown={() => padController.userPadDown('green')}
          onPointerUp={() => padController.userPadUp('green')}
          showKey={isUserTurn}
          className={classNames(
            'justify-self-end self-end rounded-tl-full text-green-600',
            padController.activePads.has('green')
              ? 'bg-green-500'
              : 'bg-green-700',
          )}
        />
        <Pad
          padId="red"
          active={padController.activePads.has('red')}
          onPointerDown={() => padController.userPadDown('red')}
          onPointerUp={() => padController.userPadUp('red')}
          showKey={isUserTurn}
          className={classNames(
            'self-end rounded-tr-full text-rose-500',
            padController.activePads.has('red') ? 'bg-rose-500' : 'bg-rose-700',
          )}
        />
        <Pad
          padId="yellow"
          active={padController.activePads.has('yellow')}
          onPointerDown={() => padController.userPadDown('yellow')}
          onPointerUp={() => padController.userPadUp('yellow')}
          showKey={isUserTurn}
          className={classNames(
            'justify-self-end rounded-bl-full text-amber-500',
            padController.activePads.has('yellow')
              ? 'bg-amber-400'
              : 'bg-amber-600',
          )}
        />
        <Pad
          padId="blue"
          active={padController.activePads.has('blue')}
          onPointerDown={() => padController.userPadDown('blue')}
          onPointerUp={() => padController.userPadUp('blue')}
          showKey={isUserTurn}
          className={classNames(
            'rounded-br-full text-blue-500',
            padController.activePads.has('blue')
              ? 'bg-blue-500'
              : 'bg-blue-700',
          )}
        />
        <div className="absolute inset-0 m-auto rounded-full w-1/3 aspect-square bg-slate-950 border-8 border-slate-900 flex items-center">
          <span className="w-full flex items-center justify-center sm:text-xl md:text-2xl lg:text-3xl">
            {isPlaying ? currentScore : ''}
          </span>
        </div>
      </div>
    </div>
  );
};
