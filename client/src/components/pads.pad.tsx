import classnames from 'classnames';
import { PAD_SCHEMA } from '../config';
import type { PadId } from '../types';

export interface PadProps {
  padId: PadId;
  active: boolean;
  onPointerDown: () => void;
  onPointerUp: () => void;
  className: string;
  showKey: boolean;
}

export const Pad = (props: PadProps) => {
  const key = PAD_SCHEMA[props.padId].key;
  return (
    <button
      aria-label={`${props.padId} pad`}
      onPointerDown={props.onPointerDown}
      onPointerUp={props.onPointerUp}
      onPointerLeave={props.onPointerUp}
      className={classnames(
        'w-full aspect-square cursor-pointer',
        props.active ? 'brightness-100' : 'brightness-75',
        props.className,
      )}
    >
      <span className="font-bold text-xl md:text-2xl">
        {props.showKey ? key : null}
      </span>
    </button>
  );
};
