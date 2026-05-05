export default function ThemeInitScript() {
  const script = `
    (function() {
      try {
        var stored = localStorage.getItem('theme');
        var dark = stored ? stored === 'dark' : true;
        document.documentElement.classList.toggle('dark', dark);
        if (!stored) {
          localStorage.setItem('theme', 'dark');
        }
      } catch (_) {
        document.documentElement.classList.add('dark');
      }
    })();
  `;

  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
