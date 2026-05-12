// Inline script que roda ANTES da hidratação React, lendo a preferência
// salva em localStorage e aplicando data-theme ao <html>. Evita flash
// (FOUC) de tema errado quando o user salvou explicitamente um modo.
const SCRIPT = `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||t==='light'){document.documentElement.setAttribute('data-theme',t);}}catch(e){}})();`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: SCRIPT }} />;
}
