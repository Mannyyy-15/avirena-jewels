import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import {useId} from 'react';

type AsideType = 'search' | 'cart' | 'mobile' | 'closed';
type AsideContextValue = {
  type: AsideType;
  open: (mode: AsideType) => void;
  close: () => void;
};

/**
 * A side bar component with Overlay
 * @example
 * ```jsx
 * <Aside type="search" heading="SEARCH">
 *  <input type="search" />
 *  ...
 * </Aside>
 * ```
 */
export function Aside({
  children,
  heading,
  type,
  noHeader = false,
}: {
  children?: React.ReactNode;
  type: AsideType;
  heading?: React.ReactNode;
  noHeader?: boolean;
}) {
  const {type: activeType, close} = useAside();
  const expanded = type === activeType;
  const id = useId();
  useEffect(() => {
    const abortController = new AbortController();

    if (expanded) {
      document.addEventListener(
        'keydown',
        function handler(event: KeyboardEvent) {
          if (event.key === 'Escape') {
            close();
          }
        },
        {signal: abortController.signal},
      );
    }
    return () => abortController.abort();
  }, [close, expanded]);

  return (
    <div
      aria-modal
      className={`overlay z-[100] ${expanded ? 'expanded' : ''}`}
      role="dialog"
      aria-labelledby={id}
    >
      <button className="close-outside" onClick={close} aria-label="Close drawer" />
      <aside className="bg-[#FAF8F5] border-l border-[#D8D2C2] text-[#413C23] shadow-2xl flex flex-col font-sans-body">
        {!noHeader && heading ? (
          <header className="p-5 border-b border-[#D8D2C2] bg-[#F2EFDB] flex items-center justify-between shrink-0">
            <h3 id={id} className="font-serif-display text-2xl font-medium text-[#413C23]">
              {heading}
            </h3>
            <button
              className="w-8 h-8 rounded-full flex items-center justify-center bg-[#FAF8F5] border border-[#D8D2C2] text-[#413C23] hover:bg-[#E7E4D5] transition-colors cursor-pointer"
              onClick={close}
              aria-label="Close"
            >
              &times;
            </button>
          </header>
        ) : null}
        <main className="flex-1 flex flex-col min-h-0 overflow-hidden m-0 p-0">{children}</main>
      </aside>
    </div>
  );
}

const AsideContext = createContext<AsideContextValue | null>(null);

Aside.Provider = function AsideProvider({children}: {children: ReactNode}) {
  const [type, setType] = useState<AsideType>('closed');

  return (
    <AsideContext.Provider
      value={{
        type,
        open: setType,
        close: () => setType('closed'),
      }}
    >
      {children}
    </AsideContext.Provider>
  );
};

export function useAside() {
  const aside = useContext(AsideContext);
  if (!aside) {
    throw new Error('useAside must be used within an AsideProvider');
  }
  return aside;
}

export function useOptionalAside() {
  return useContext(AsideContext);
}
