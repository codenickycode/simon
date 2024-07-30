import type { InputHTMLAttributes } from 'react';
import classnames from 'classnames';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export const Input = (props: InputProps) => {
  const { className, ...inputProps } = props;
  return (
    <input
      {...inputProps}
      className={classnames(
        'px-4 py-2 rounded-md  text-slate-950 bg-slate-200',
        // todo: twMerge
        className,
      )}
    />
  );
};
