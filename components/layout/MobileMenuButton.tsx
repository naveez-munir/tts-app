import { cn } from '@/lib/utils';

interface MobileMenuButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

export function MobileMenuButton({ isOpen, onClick }: MobileMenuButtonProps) {
  return (
    <button
      type="button"
      className="relative inline-flex h-11 w-11 items-center justify-center rounded-lg bg-neutral-100 text-neutral-700 transition-all duration-200 hover:bg-neutral-200 lg:hidden"
      onClick={onClick}
      aria-label="Toggle menu"
      aria-expanded={isOpen}
    >
      <div className="relative h-5 w-5">
        <span
          className={cn(
            'absolute left-0 h-0.5 w-5 rounded-full bg-current transition-all duration-300',
            isOpen ? 'top-2 rotate-45' : 'top-0'
          )}
        />
        <span
          className={cn(
            'absolute left-0 top-2 h-0.5 w-5 rounded-full bg-current transition-all duration-300',
            isOpen ? 'opacity-0' : 'opacity-100'
          )}
        />
        <span
          className={cn(
            'absolute left-0 h-0.5 w-5 rounded-full bg-current transition-all duration-300',
            isOpen ? 'top-2 -rotate-45' : 'top-4'
          )}
        />
      </div>
    </button>
  );
}

