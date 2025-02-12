import BoggleBoard from "./ui/boggle-board";
import Timer from "./ui/timer";

export default function Page()  {
  return (
  <div className="flex flex-col items-center justify-center h-screen gap-4">
    <h1>Boggle</h1>
    <BoggleBoard key="mainBoard"/>
    
  </div>)
};
