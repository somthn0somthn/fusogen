'use client';

import { WalletButton } from '../solana/solana-provider';
import * as React from 'react';
import { ReactNode, Suspense, useEffect, useRef } from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { AccountChecker } from '../account/account-ui';
import {
  ClusterChecker,
  ClusterUiSelect,
  ExplorerLink,
} from '../cluster/cluster-ui';
import toast, { Toaster } from 'react-hot-toast';

export function UiLayout({
  children,
  links,
}: {
  children: ReactNode;
  links: { label: string; path: string }[];
}) {
  const pathname = usePathname();

  return (
    <div className="h-full flex bg-[#0b1a1c] flex-col">
      {/* Conditionally render navbar if not on the landing page */}
      {pathname !== '/' && (
        <div className="navbar bg-[#5ac3b8] text-neutral-content flex-col md:flex-row space-y-2 md:space-y-0">
          <div className="flex-1">
            <Link className="btn btn-ghost normal-case text-xl" href="/">
              <img className="h-4 md:h-6" alt="Logo" src="/logo.png" />
            </Link>
            <ul className="menu menu-horizontal px-1 space-x-2">
              {links.map(({ label, path }) => (
                <li key={path}>
                  <Link
                    className={pathname.startsWith(path) ? 'active' : ''}
                    href={path}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex-none space-x-2">
            <WalletButton />
            <ClusterUiSelect />
          </div>
        </div>
      )}

      {/* Conditionally render ClusterChecker and AccountChecker if not on the landing page */}
      {pathname !== '/' && (
        <ClusterChecker>
          <AccountChecker />
        </ClusterChecker>
      )}

      {/* This is the issue */}
      
        <div className="flex-grow bg-[#0b1a1c] mx-4 lg:mx-auto">
          <Suspense
            fallback={
              <div className="text-center my-32">
                <span className="loading loading-spinner loading-lg"></span>
              </div>
            }
          >
            {children}
          </Suspense>
          <Toaster position="bottom-right" />
        </div>
      

      {/* Conditionally render footer if not on the landing page */}
      {pathname !== '/' && (
        <footer className="footer footer-center p-4 bg-[#0b1a1c] text-base-content">
          <aside>
            <p>
              Video: {' '}
              <a
                className="link hover:text-white"
                href="https://journals.biologists.com/dev/article/149/12/dev200226/275796/SyNPL-Synthetic-Notch-pluripotent-cell-lines-to"
                target="_blank"
                rel="noopener noreferrer"
              >
                Mattias, et al
              </a>
            </p>
          </aside>
        </footer>
      )}
    </div>
  );
}

export function AppModal({
  children,
  title,
  hide,
  show,
  submit,
  submitDisabled,
  submitLabel,
}: {
  children: ReactNode;
  title: string;
  hide: () => void;
  show: boolean;
  submit?: () => void;
  submitDisabled?: boolean;
  submitLabel?: string;
}) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    if (!dialogRef.current) return;
    if (show) {
      dialogRef.current.showModal();
    } else {
      dialogRef.current.close();
    }
  }, [show, dialogRef]);

  return (
    <dialog className="modal" ref={dialogRef}>
      <div className="modal-box space-y-5">
        <h3 className="font-bold text-lg">{title}</h3>
        {children}
        <div className="modal-action">
          <div className="join space-x-2">
            {submit ? (
              <button
                className="btn btn-xs lg:btn-md btn-primary"
                onClick={submit}
                disabled={submitDisabled}
              >
                {submitLabel || 'Save'}
              </button>
            ) : null}
            <button onClick={hide} className="btn">
              Close
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
}

export function AppHero({
  children,
  title,
  subtitle,
}: {
  children?: ReactNode;
  title: ReactNode;
  subtitle: ReactNode;
}) {
  return (
    <div className="hero py-[64px]">
      <div className="hero-content text-center">
        <div className="max-w-2xl">
          {typeof title === 'string' ? (
            <h1 className="text-5xl font-bold">{title}</h1>
          ) : (
            title
          )}
          {typeof subtitle === 'string' ? (
            <p className="py-6">{subtitle}</p>
          ) : (
            subtitle
          )}
          {children}
        </div>
      </div>
    </div>
  );
}

export function ellipsify(str = '', len = 4) {
  if (str.length > 30) {
    return (
      str.substring(0, len) + '..' + str.substring(str.length - len, str.length)
    );
  }
  return str;
}

export function useTransactionToast() {
  return (signature: string) => {
    toast.success(
      <div className={'text-center'}>
        <div className="text-lg">Transaction sent</div>
        <ExplorerLink
          path={`tx/${signature}`}
          label={'View Transaction'}
          className="btn btn-xs btn-primary"
        />
      </div>
    );
  };
}
