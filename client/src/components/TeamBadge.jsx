import { useState } from 'react';
import { getTeamBadgeUrl, getFlag, isPlayoffTeam } from '../lib/constants';

const SIZES = {
  xs: 'w-5 h-5',
  sm: 'w-6 h-6',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
  xl: 'w-16 h-16',
};

export default function TeamBadge({ team, size = 'md', showPlayoffBadge = false, className = '' }) {
  const [imgError, setImgError] = useState(false);
  const badgeUrl = getTeamBadgeUrl(team);
  const isPlayoff = isPlayoffTeam(team);
  const sizeClass = SIZES[size] || SIZES.md;

  if (!badgeUrl || imgError) {
    return (
      <span className={`inline-flex items-center justify-center ${sizeClass} ${className}`}>
        <span className={size === 'lg' || size === 'xl' ? 'text-2xl' : size === 'md' ? 'text-lg' : 'text-sm'}>
          {getFlag(team)}
        </span>
      </span>
    );
  }

  return (
    <span className={`relative inline-flex items-center justify-center ${className}`}>
      <img
        src={badgeUrl}
        alt={team}
        className={`${sizeClass} rounded-full object-cover ${
          isPlayoff && showPlayoffBadge
            ? 'border-2 border-dashed border-dorado/40 opacity-70'
            : 'border-2 border-white/10'
        }`}
        onError={() => setImgError(true)}
        loading="lazy"
      />
      {isPlayoff && showPlayoffBadge && (
        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2
                         bg-dorado/20 text-dorado text-[6px] font-bold
                         px-1 py-px rounded-sm uppercase whitespace-nowrap
                         border border-dorado/30">
          ?
        </span>
      )}
    </span>
  );
}
