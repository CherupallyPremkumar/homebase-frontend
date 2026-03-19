'use client';

import * as React from 'react';
import { Search } from 'lucide-react';

import { cn } from './lib/utils';

type CommandContextValue = {
  search: string;
  setSearch: (value: string) => void;
};

const CommandContext = React.createContext<CommandContextValue>({
  search: '',
  setSearch: () => {},
});

const useCommand = () => React.useContext(CommandContext);

const Command = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const [search, setSearch] = React.useState('');

  return (
    <CommandContext.Provider value={{ search, setSearch }}>
      <div
        ref={ref}
        className={cn(
          'flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground',
          className
        )}
        {...props}
      >
        {children}
      </div>
    </CommandContext.Provider>
  );
});
Command.displayName = 'Command';

const CommandInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => {
  const { search, setSearch } = useCommand();

  return (
    <div className="flex items-center border-b px-3" data-command-input-wrapper="">
      <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
      <input
        ref={ref}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className={cn(
          'flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        {...props}
      />
    </div>
  );
});
CommandInput.displayName = 'CommandInput';

const CommandList = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('max-h-[300px] overflow-y-auto overflow-x-hidden', className)}
    {...props}
  />
));
CommandList.displayName = 'CommandList';

const CommandEmpty = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('py-6 text-center text-sm', className)}
    {...props}
  />
));
CommandEmpty.displayName = 'CommandEmpty';

const CommandGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { heading?: string }
>(({ className, heading, children, ...props }, ref) => {
  const { search } = useCommand();
  const groupRef = React.useRef<HTMLDivElement>(null);

  const [hasVisibleItems, setHasVisibleItems] = React.useState(true);

  React.useEffect(() => {
    if (!groupRef.current) return;
    const items = groupRef.current.querySelectorAll('[data-command-item]');
    let visible = 0;
    items.forEach((item) => {
      const text = item.textContent?.toLowerCase() ?? '';
      const match = !search || text.includes(search.toLowerCase());
      (item as HTMLElement).style.display = match ? '' : 'none';
      if (match) visible++;
    });
    setHasVisibleItems(visible > 0);
  }, [search]);

  if (!hasVisibleItems) return null;

  return (
    <div
      ref={ref}
      className={cn(
        'overflow-hidden p-1 text-foreground [&_[data-command-item]]:px-2 [&_[data-command-item]]:py-1.5',
        className
      )}
      {...props}
    >
      {heading && (
        <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
          {heading}
        </div>
      )}
      <div ref={groupRef}>{children}</div>
    </div>
  );
});
CommandGroup.displayName = 'CommandGroup';

const CommandItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    disabled?: boolean;
    onSelect?: () => void;
  }
>(({ className, disabled, onSelect, ...props }, ref) => (
  <div
    ref={ref}
    data-command-item=""
    data-disabled={disabled || undefined}
    aria-disabled={disabled || undefined}
    role="option"
    onClick={() => {
      if (!disabled && onSelect) onSelect();
    }}
    onKeyDown={(e) => {
      if (!disabled && onSelect && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        onSelect();
      }
    }}
    tabIndex={disabled ? -1 : 0}
    className={cn(
      'relative flex cursor-default gap-2 select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
      className
    )}
    {...props}
  />
));
CommandItem.displayName = 'CommandItem';

const CommandSeparator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('-mx-1 h-px bg-border', className)}
    {...props}
  />
));
CommandSeparator.displayName = 'CommandSeparator';

const CommandShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn(
        'ml-auto text-xs tracking-widest text-muted-foreground',
        className
      )}
      {...props}
    />
  );
};
CommandShortcut.displayName = 'CommandShortcut';

export {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
  CommandShortcut,
};
