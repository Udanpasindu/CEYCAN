import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './styles/tailwind.css';

// Add preload hints for critical resources
const preloadLinks = [
  { rel: 'preload', href: '/favicon.ico', as: 'image' },
  { rel: 'preload', href: '/Spices-Banner.jpg', as: 'image' },
  { rel: 'preload', href: '/sri-lankan-spices.jpg', as: 'image' }
];

preloadLinks.forEach(({ rel, href, as }) => {
  const link = document.createElement('link');
  link.rel = rel;
  link.href = href;
  link.as = as;
  document.head.appendChild(link);
});

createRoot(document.getElementById("root")!).render(<App />);
