// Persistent shell around all pages: header + bottom action bar.
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

export function Layout(): JSX.Element {
  const location = useLocation();
  // Hide the bottom bar on the report page (the form is already the whole page)
  const hideBottomBar = location.pathname === '/melden';

  return (
    <div className="flex flex-col min-h-dvh bg-black text-white font-mono">
      {/* ── Header ─────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 flex items-center justify-between px-4 py-3 border-b border-zinc-800 bg-black">
        <Link
          to="/"
          className="text-sm font-bold uppercase tracking-widest hover:text-zinc-400 transition-colors"
        >
          [ SCHWARZKAPPLER ]
        </Link>

        {/* Placeholder — help page or modal to be added later */}
        <button
          className="text-zinc-600 hover:text-white transition-colors text-sm border border-zinc-800 w-7 h-7 flex items-center justify-center"
          aria-label="Hilfe"
        >
          ?
        </button>
      </header>

      {/* ── Main content ───────────────────────────────────── */}
      <main className={`flex-1 overflow-y-auto ${hideBottomBar ? '' : 'pb-20'}`}>
        <Outlet />
      </main>

      {/* ── Fixed bottom action bar ─────────────────────────── */}
      {!hideBottomBar && (
        <nav className="fixed bottom-0 left-0 right-0 z-40 bg-black border-t border-zinc-800 px-4 py-3">
          <Link
            to="/melden"
            className="flex items-center justify-center w-full py-3 border border-white text-sm uppercase tracking-widest font-bold hover:bg-white hover:text-black transition-colors"
          >
            [ + ] MELDUNG EINREICHEN
          </Link>
        </nav>
      )}

      {/* Toast notifications — dark terminal style */}
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: '#09090b',
            color: '#ffffff',
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: '13px',
            border: '1px solid #27272a',
            borderRadius: '0',
          },
          success: {
            iconTheme: { primary: '#22c55e', secondary: '#09090b' },
          },
          error: {
            iconTheme: { primary: '#ef4444', secondary: '#09090b' },
          },
        }}
      />
    </div>
  );
}
