import type { FormEvent } from 'react';
import { useState } from 'react';
import { Input } from './ui.input';
import { Button } from './ui.button';
import { Spinner } from './ui.spinner';

interface NewHighScoreProps {
  onSubmit: (name: string) => void;
  disabled: boolean;
  pending: boolean;
  error: string;
}

export const NewHighScore = (props: NewHighScoreProps) => {
  const [userName, setUserName] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    props.onSubmit(userName);
  };

  return (
    <div>
      <h2 className="text-2xl mb-4">
        High Score!
        <span className="ml-3">🚀 🚀 🚀</span>
      </h2>
      <p className="text-balance text-sm mb-4">
        Congrats! You have the new high score. Enter your name for the global
        scoreboard:
      </p>
      <form onSubmit={handleSubmit}>
        <Input
          name="userName"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="Enter your name"
          disabled={props.disabled}
          className="mr-2"
          maxLength={48}
        />
        <Button type="submit" disabled={props.disabled}>
          <Spinner isSpinning={props.pending}>
            <span className="font-bold">save</span>
          </Spinner>
        </Button>
        {props.error ? (
          <pre className="mt-3 text-red-500 text-sm text-balance whitespace-pre-wrap">
            {props.error}
          </pre>
        ) : null}
      </form>
    </div>
  );
};
