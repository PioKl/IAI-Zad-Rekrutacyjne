import '../styles/App.scss';
import Xbox from './Xbox';
import Navigation from './Navigation';

function App() {

  return (
    <div className="App">
      <header>
        <Navigation />
      </header>
      <main>
        <Xbox />
      </main>
      <footer></footer>
    </div>
  );
}

export default App;
