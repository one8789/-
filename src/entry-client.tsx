import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '../App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

// 检查 root 元素内是否有子元素（不包括注释节点 <!--app-html-->）
// 生产环境 SSG 构建后会有 DOM 元素，使用 hydrateRoot
// 开发环境只有占位符，使用 createRoot
const hasContent = rootElement.hasChildNodes() && 
                   Array.from(rootElement.childNodes).some(node => node.nodeType === Node.ELEMENT_NODE);

if (hasContent) {
  console.log('Hydrating app (SSG mode)...');
  ReactDOM.hydrateRoot(
    rootElement,
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  console.log('Rendering app (CSR Dev mode)...');
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}