import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import "./index.css";
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom'; // Corrected import path

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);