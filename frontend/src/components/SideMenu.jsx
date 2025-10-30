import { NavLink } from 'react-router-dom';
import {
  HomeIcon,
  ChatBubbleLeftRightIcon,
  AcademicCapIcon,
  TrophyIcon,
  BellAlertIcon,
  UserCircleIcon,
  CommandLineIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../hooks/useAuth.js';

const links = [
  { to: '/', label: 'Banter Feed', icon: HomeIcon },
  { to: '/forums', label: 'Forums', icon: ChatBubbleLeftRightIcon },
  { to: '/leaderboard', label: 'Leaderboard', icon: TrophyIcon },
  { to: '/notifications', label: 'Notifications', icon: BellAlertIcon },
  { to: '/profile', label: 'Profile', icon: UserCircleIcon },
  { to: '/chat', label: 'Chat', icon: AcademicCapIcon },
];

export const SideMenu = () => {
  const { user } = useAuth();
  const items = user?.roles?.includes('admin')
    ? [...links, { to: '/admin', label: 'Admin', icon: CommandLineIcon }]
    : links;

  return (
    <aside className="hidden w-64 flex-shrink-0 flex-col gap-2 rounded-3xl bg-white p-4 shadow-lg md:flex">
      {items.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition hover:bg-guff-sand/80 ${
              isActive ? 'bg-guff-sand text-guff-dusk' : 'text-slate-600'
            }`
          }
        >
          <Icon className="h-5 w-5" />
          {label}
        </NavLink>
      ))}
    </aside>
  );
};
