import canvas from "./canvas";
import Home from "./pages/home";
import Customizer from "./pages/Customizer";
import Canvas from "./canvas";

function App() {

  return (
   <main className="app bg-amber-100">
    <Home />
    <Canvas />
    <Customizer />
   </main>
  )
}

export default App;
