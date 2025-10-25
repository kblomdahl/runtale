import { render } from 'preact'
import '../styles/tokens.css'
import '../styles/base.css'
import App from './App.tsx'

const root = document.getElementById('root');

if (root) {
  render(<App />, root);
}
