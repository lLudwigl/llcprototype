// Persistent shell around all pages: header + bottom action bar.
// On desktop, the app is rendered inside a phone-sized frame centred on screen.
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

export function Layout(): JSX.Element {
  const location = useLocation();
  // Hide the bottom bar on the report page (the form is already the whole page)
  const hideBottomBar = location.pathname === '/melden';

  return (
    /* ── Desktop wrapper — dark bg fills the screen around the phone frame ── */
    <div className="h-dvh w-full flex items-center justify-center">

      {/* ── Phone frame ─────────────────────────────────────────────────── */}
      <div
        className="relative flex flex-col bg-gray-50 overflow-hidden"
        style={{
          width: '390px',
          height: '844px',
          maxHeight: '100dvh',
          borderRadius: '40px',
          boxShadow: '0 0 0 10px #2a2a3e, 0 30px 80px rgba(0,0,0,0.6)',
        }}
      >
        {/* ── Header ─────────────────────────────────────────── */}
        <header className="flex-shrink-0 flex items-center justify-center px-4 py-4 bg-[#0F1B3C] shadow-sm">
          <Link
            to="/"
            className="text-lg font-bold uppercase tracking-widest text-white hover:text-white/80 transition-colors"
          >
            SCHWARZKAPPLER
          </Link>
        </header>

        {/* ── Main content ───────────────────────────────────── */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>

        {/* ── Fixed bottom action bar ─────────────────────────── */}
        {!hideBottomBar && (
          <nav className="flex-shrink-0 bg-white border-t border-gray-100 px-4 py-3 shadow-lg">
            <Link
              to="/melden"
              className="flex items-center justify-center w-full py-3.5 bg-[#0F1B3C] text-white text-sm uppercase tracking-widest font-bold rounded-xl hover:bg-[#0b1530] transition-colors"
            >
              + MELDUNG EINREICHEN
            </Link>
          </nav>
        )}
      </div>

      {/* Toast notifications */}
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: '#ffffff',
            color: '#0F1B3C',
            fontFamily: 'Inter, sans-serif',
            fontSize: '13px',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
          },
          success: {
            iconTheme: { primary: '#22c55e', secondary: '#ffffff' },
          },
          error: {
            iconTheme: { primary: '#ef4444', secondary: '#ffffff' },
          },
        }}
      />
    </div>
  );
}
