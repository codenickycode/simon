import { Pad } from "./Pad";

export const Gamepad = () => {
  return (
    <div className="relative inline-block">
      <div className="flex flex-row">
        <Pad color="green" active={false} />
        <Pad color="red" active={false} />
      </div>
      <div className="flex flex-row">
        <Pad color="yellow" active={false} />
        <Pad color="blue" active={false} />
      </div>
      {/* center circle */}
      <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-black rounded-full z-10"></div>
    </div>
  );
};
