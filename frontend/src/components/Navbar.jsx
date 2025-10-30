import { Fragment } from 'react';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, BellIcon } from '@heroicons/react/24/outline';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const links = [
  { to: '/', label: 'Banter Feed' },
  { to: '/forums', label: 'Forums' },
  { to: '/leaderboard', label: 'Leaderboard' },
  { to: '/chat', label: 'Messages' }
];

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <Disclosure as="nav" className="border-b border-slate-200 bg-white/90 backdrop-blur">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center gap-8">
                <Link to="/" className="text-xl font-black text-primary">
                  GuffGaff
                </Link>
                <div className="hidden md:flex md:items-center md:space-x-4">
                  {links.map((link) => (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      className={({ isActive }) =>
                        `rounded-xl px-3 py-2 text-sm font-semibold transition ${
                          isActive ? 'bg-primary/10 text-primary' : 'text-slate-600 hover:bg-slate-100'
                        }`
                      }
                    >
                      {link.label}
                    </NavLink>
                  ))}
                  {user?.roles?.includes('admin') && (
                    <NavLink
                      to="/admin"
                      className={({ isActive }) =>
                        `rounded-xl px-3 py-2 text-sm font-semibold transition ${
                          isActive ? 'bg-primary/10 text-primary' : 'text-slate-600 hover:bg-slate-100'
                        }`
                      }
                    >
                      Admin
                    </NavLink>
                  )}
                </div>
              </div>
              <div className="hidden items-center gap-3 md:flex">
                <Link to="/notifications" className="rounded-full p-2 text-slate-500 hover:bg-slate-100">
                  <BellIcon className="h-6 w-6" />
                </Link>
                <Menu as="div" className="relative">
                  <Menu.Button className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-2 py-1">
                    <img
                      className="h-10 w-10 rounded-full object-cover"
                      src={user?.profilePicture || `https://api.dicebear.com/7.x/thumbs/svg?seed=${user?.username}`}
                      alt={user?.username}
                    />
                    <div className="text-left">
                      <p className="text-sm font-semibold text-slate-700">{user?.username}</p>
                      <p className="text-xs text-slate-500">{user?.rank}</p>
                    </div>
                  </Menu.Button>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-3 w-48 origin-top-right rounded-2xl bg-white p-2 shadow-lg ring-1 ring-black/5">
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to="/profile"
                            className={`block rounded-xl px-3 py-2 text-sm font-medium ${
                              active ? 'bg-slate-100 text-primary' : 'text-slate-600'
                            }`}
                          >
                            My Profile
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            type="button"
                            onClick={logout}
                            className={`w-full rounded-xl px-3 py-2 text-left text-sm font-medium ${
                              active ? 'bg-slate-100 text-primary' : 'text-slate-600'
                            }`}
                          >
                            Sign out
                          </button>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
              <div className="md:hidden">
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-primary">
                  <Bars3Icon className="h-6 w-6" />
                </Disclosure.Button>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="md:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {links.map((link) => (
                <Disclosure.Button
                  key={link.to}
                  as={NavLink}
                  to={link.to}
                  className={({ isActive }) =>
                    `block rounded-xl px-3 py-2 text-base font-semibold transition ${
                      isActive ? 'bg-primary/10 text-primary' : 'text-slate-600 hover:bg-slate-100'
                    }`
                  }
                >
                  {link.label}
                </Disclosure.Button>
              ))}
              {user?.roles?.includes('admin') && (
                <Disclosure.Button
                  as={NavLink}
                  to="/admin"
                  className={({ isActive }) =>
                    `block rounded-xl px-3 py-2 text-base font-semibold transition ${
                      isActive ? 'bg-primary/10 text-primary' : 'text-slate-600 hover:bg-slate-100'
                    }`
                  }
                >
                  Admin
                </Disclosure.Button>
              )}
              <Disclosure.Button as={NavLink} to="/notifications" className="block rounded-xl px-3 py-2 text-base font-semibold text-slate-600 hover:bg-slate-100">
                Notifications
              </Disclosure.Button>
              <Disclosure.Button as="button" onClick={logout} className="block w-full rounded-xl px-3 py-2 text-left text-base font-semibold text-slate-600 hover:bg-slate-100">
                Sign out
              </Disclosure.Button>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
