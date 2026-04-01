'use client';
import React from 'react';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { MenuToggleIcon } from '@/components/ui/menu-toggle-icon';
import { useScroll } from '@/components/ui/use-scroll';
import { ThemeToggle } from '@/components/theme-toggle';
import { LanguageSelector } from '@/components/language-selector';
import { useTranslation } from '@/lib/i18n/context';
import { Logo } from '@/components/ui/logo';

export function Header() {
	const [open, setOpen] = React.useState(false);
	const scrolled = useScroll(10);
	const { t } = useTranslation();

	const links = [
		{
			label: t("nav.features"),
			href: '#features',
		},
		{
			label: t("nav.howItWorks"),
			href: '#how-it-works',
		},
		{
			label: 'Demo',
			href: '/demo',
		},
		{
			label: 'Crisis Support',
			href: '/crisis',
			className: 'text-red-500 hover:text-red-600',
		},
	];

	React.useEffect(() => {
		if (open) {
			// Disable scroll
			document.body.style.overflow = 'hidden';
		} else {
			// Re-enable scroll
			document.body.style.overflow = '';
		}

		// Cleanup when component unmounts (important for Next.js)
		return () => {
			document.body.style.overflow = '';
		};
	}, [open]);

	return (
		<header
			className={cn(
				'sticky top-0 z-50 mx-auto w-full max-w-5xl border-b border-transparent md:rounded-md md:border md:transition-all md:ease-out',
				{
					'bg-background/95 supports-[backdrop-filter]:bg-background/50 border-border backdrop-blur-lg md:top-4 md:max-w-4xl md:shadow':
						scrolled && !open,
					'bg-background/90': open,
				},
			)}
		>
			<nav
				className={cn(
					'flex h-14 w-full items-center justify-between px-4 md:h-12 md:transition-all md:ease-out',
					{
						'md:px-2': scrolled,
					},
				)}
			>
				<Logo size="sm" />
				<div className="hidden items-center gap-1 md:flex md:flex-1 md:justify-center" suppressHydrationWarning>
					{links.map((link, i) => (
						<a
							key={i}
							suppressHydrationWarning
							className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), link.className, 'text-sm h-auto')}
							href={link.href}
						>
							{link.label}
						</a>
					))}
				</div>
				<div className="hidden md:flex items-center gap-2">
					<LanguageSelector />
					<ThemeToggle />
					<Button suppressHydrationWarning size="sm" onClick={() => window.location.href = '/login'}>{t("nav.getStarted")}</Button>
				</div>
				<div className="flex md:hidden gap-2 items-center">
					<LanguageSelector />
					<ThemeToggle />
					<Button size="icon" variant="outline" onClick={() => setOpen(!open)} className="md:hidden">
						<MenuToggleIcon open={open} className="size-5" duration={300} />
					</Button>
				</div>
			</nav>

			<div
				className={cn(
					'bg-background/90 fixed top-14 right-0 bottom-0 left-0 z-40 flex flex-col overflow-hidden border-y md:hidden',
					open ? 'block' : 'hidden',
				)}
				suppressHydrationWarning
			>
				<div
					data-slot={open ? 'open' : 'closed'}
					className={cn(
						'data-[slot=open]:animate-in data-[slot=open]:zoom-in-95 data-[slot=closed]:animate-out data-[slot=closed]:zoom-out-95 ease-out',
						'flex h-full w-full flex-col justify-between gap-y-2 p-4',
					)}
				>
					<div className="grid gap-y-2">
						{links.map((link) => (
							<a
								key={link.label}
								className={cn(
									buttonVariants({
										variant: 'ghost',
										className: 'justify-start',
									}),
									link.className
								)}
								href={link.href}
								onClick={() => setOpen(false)}
							>
								{link.label}
							</a>
						))}
					</div>
					<div className="flex flex-col gap-2">
						<div className="flex items-center gap-2 mb-2">
							<LanguageSelector />
							<ThemeToggle />
						</div>
						<Button suppressHydrationWarning className="w-full" onClick={() => window.location.href = '/login'}>
							{t("nav.getStarted")}
						</Button>
					</div>
				</div>
			</div>
		</header>
	);
}
