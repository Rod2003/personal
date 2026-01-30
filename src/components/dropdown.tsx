'use client';

import * as React from 'react';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { ChevronDown, Check } from 'lucide-react';

import { cn } from '../utils/utils';

const DropdownMenu = DropdownMenuPrimitive.Root;

const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;

const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        'z-50 min-w-[8rem] overflow-hidden rounded-md border border-foreground/20 bg-background p-1 shadow-md font-vga',
        'data-[state=open]:animate-in data-[state=closed]:animate-out',
        'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
        'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
        'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2',
        'data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
        '[&_*]:font-vga',
        className,
      )}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
));
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;

const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
    selected?: boolean;
  }
>(({ className, selected, children, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      'relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-xs sm:text-sm outline-none transition-colors',
      'text-foreground',
      'focus:bg-yellow/10 focus:text-yellow',
      'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      selected && 'text-yellow',
      className,
    )}
    {...props}
  >
    <span className="flex-1 truncate">{children}</span>
    {selected && <Check className="ml-2 h-3 w-3 shrink-0" />}
  </DropdownMenuPrimitive.Item>
));
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;

const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={cn('px-2 py-1.5 text-xs text-gray', className)}
    {...props}
  />
));
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName;

const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={cn('-mx-1 my-1 h-px bg-foreground/10', className)}
    {...props}
  />
));
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName;

// Custom Select-like dropdown component
interface TrackSelectProps {
  tracks: Array<{
    id: string;
    name: string;
    artist?: string;
  }>;
  value: string;
  onChange: (id: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

const TrackSelect: React.FC<TrackSelectProps> = ({
  tracks,
  value,
  onChange,
  disabled = false,
  placeholder = '-- select a track --',
}) => {
  const [open, setOpen] = React.useState(false);
  
  const selectedTrack = tracks.find(t => t.id === value);
  const displayText = selectedTrack
    ? `${selectedTrack.name}${selectedTrack.artist ? ` - ${selectedTrack.artist}` : ''}`
    : placeholder;

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        disabled={disabled || tracks.length === 0}
        className={cn(
          'flex-1 flex items-center justify-between gap-2',
          'bg-background border border-foreground/30 rounded px-3 py-2',
          'text-foreground text-xs sm:text-sm text-left',
          'focus:outline-none focus:border-yellow transition-colors',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          !selectedTrack && 'text-gray',
        )}
      >
        <span className="truncate">
          {tracks.length === 0 ? '-- no tracks available --' : displayText}
        </span>
        <ChevronDown className={cn(
          'h-4 w-4 shrink-0 text-gray transition-transform duration-200',
          open && 'rotate-180',
        )} />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="w-[var(--radix-dropdown-menu-trigger-width)] max-h-[300px] overflow-y-auto"
      >
        <DropdownMenuItem
          onSelect={() => onChange('')}
          selected={!value}
        >
          {placeholder}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {tracks.map((track) => (
          <DropdownMenuItem
            key={track.id}
            onSelect={() => onChange(track.id)}
            selected={track.id === value}
          >
            {track.name}{track.artist ? ` - ${track.artist}` : ''}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  TrackSelect,
};
