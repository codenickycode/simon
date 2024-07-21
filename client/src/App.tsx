import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Gamepad } from "./components/Gamepad/Gamepad";
import { useGameMachine } from "./services/game-machine";
import { HighScore } from "./components/HighScore";

const queryClient = new QueryClient();

function App() {
  const gameMachine = useGameMachine();
  return (
    <QueryClientProvider client={queryClient}>
      <main className="font-sans text-stone-100 overflow-hidden fixed h-dvh w-full touch-none bg-gradient-to-b from-slate-700 to-sky-950 flex items-center justify-center">
        <div className="w-full h-full max-h-[750px] flex flex-col max-w-screen-xl items-center justify-evenly">
          <div className="h-24 w-full flex items-start justify-center">
            <HighScore
              isGameOver={gameMachine.isGameOver}
              userScore={gameMachine.userScore}
            />
          </div>
          <div>
            <Gamepad
              isComputerTurn={gameMachine.isComputerTurn}
              isUserTurn={gameMachine.isUserTurn}
              onUserPadDown={gameMachine.actions.input}
              onStartClick={gameMachine.actions.startNewGame}
              isStartDisabled={
                gameMachine.isUserTurn || gameMachine.isComputerTurn
              }
              currentScore={gameMachine.currentScore}
            />
          </div>
          <div className="h-24 flex flex-col items-center">
            {gameMachine.isGameOver && (
              <p className="mt-4 text-2xl font-bold">Game Over</p>
            )}
          </div>
        </div>
      </main>
    </QueryClientProvider>
  );
}

export default App;
