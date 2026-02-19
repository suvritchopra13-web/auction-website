import { Link } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { centsToDollars } from '../utils/helpers';
import type { TickerEvent } from '../data/mockData';

function getBadgeStyle(type: TickerEvent['type']): React.CSSProperties {
  switch (type) {
    case 'bid':
      return {
        background: 'var(--color-primary-900)',
        color: 'var(--color-primary-300)',
        border: '1px solid var(--color-primary-700)',
      };
    case 'sold':
      return {
        background: 'var(--color-success-900)',
        color: 'var(--color-success-300)',
        border: '1px solid var(--color-success-700)',
      };
    case 'new':
      return {
        background: 'var(--color-accent-900)',
        color: 'var(--color-accent-300)',
        border: '1px solid var(--color-accent-700)',
      };
  }
}

function getBadgeLabel(type: TickerEvent['type']): string {
  switch (type) {
    case 'bid':
      return 'BID';
    case 'sold':
      return 'SOLD';
    case 'new':
      return 'NEW';
  }
}

function getActionText(type: TickerEvent['type']): string {
  switch (type) {
    case 'bid':
      return 'placed a bid on';
    case 'sold':
      return 'won';
    case 'new':
      return 'listed';
  }
}

interface TickerItemProps {
  event: TickerEvent;
}

function TickerItem({ event }: TickerItemProps) {
  const badgeStyle = getBadgeStyle(event.type);
  const actionText = getActionText(event.type);

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 'var(--space-3)',
        padding: '0 var(--space-8)',
        whiteSpace: 'nowrap',
        flexShrink: 0,
      }}
    >
      {/* Type badge */}
      <span
        style={{
          ...badgeStyle,
          display: 'inline-flex',
          alignItems: 'center',
          padding: '2px 8px',
          borderRadius: 'var(--radius-full)',
          fontFamily: 'var(--font-body)',
          fontSize: 'var(--text-xs)',
          fontWeight: 700,
          letterSpacing: '0.06em',
          flexShrink: 0,
        }}
      >
        {getBadgeLabel(event.type)}
      </span>

      {/* Username */}
      <span
        style={{
          color: 'var(--color-neutral-300)',
          fontWeight: 600,
          fontSize: 'var(--text-sm)',
        }}
      >
        {event.username}
      </span>

      {/* Action text */}
      <span
        style={{
          color: 'var(--color-neutral-500)',
          fontSize: 'var(--text-sm)',
        }}
      >
        {actionText}
      </span>

      {/* Amount (if applicable) */}
      {event.amount !== undefined && (
        <span
          style={{
            color: 'var(--color-success-400)',
            fontWeight: 600,
            fontSize: 'var(--text-sm)',
            fontFamily: 'var(--font-display)',
          }}
        >
          {centsToDollars(event.amount)}
        </span>
      )}

      {/* Listing title link */}
      <Link
        to={'/listings/' + event.slug}
        style={{
          color: 'var(--color-neutral-200)',
          fontWeight: 500,
          fontSize: 'var(--text-sm)',
          textDecoration: 'none',
          borderBottom: '1px solid var(--color-neutral-600)',
          transition: 'color var(--transition-fast), border-color var(--transition-fast)',
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLAnchorElement).style.color = 'var(--color-primary-300)';
          (e.currentTarget as HTMLAnchorElement).style.borderBottomColor = 'var(--color-primary-500)';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLAnchorElement).style.color = 'var(--color-neutral-200)';
          (e.currentTarget as HTMLAnchorElement).style.borderBottomColor = 'var(--color-neutral-600)';
        }}
      >
        {event.listingTitle}
      </Link>

      {/* Separator dot */}
      <span
        style={{
          color: 'var(--color-neutral-700)',
          fontSize: '1.25rem',
          lineHeight: 1,
          userSelect: 'none',
        }}
      >
        &bull;
      </span>
    </div>
  );
}

export const LiveTicker = () => {
  const { tickerEvents } = useAppStore();

  if (tickerEvents.length === 0) {
    return null;
  }

  // Duplicate items for seamless infinite loop
  const doubled = [...tickerEvents, ...tickerEvents];

  return (
    <div
      style={{
        background: 'var(--color-neutral-900)',
        borderBottom: '1px solid var(--color-neutral-800)',
        overflow: 'hidden',
        position: 'relative',
        zIndex: 'var(--z-ticker)',
        height: '38px',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <div
        className="ticker-track"
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {doubled.map((event, index) => (
          <TickerItem key={event.id + '-' + index} event={event} />
        ))}
      </div>
    </div>
  );
};
