import { useState } from "react";
import Scene from "./components/planet";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <Scene />
    </div>
  );
}

export default App;
