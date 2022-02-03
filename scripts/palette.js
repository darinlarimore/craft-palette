import React, { useEffect, useState } from 'react'
import * as HeroIcons from '@heroicons/react/outline'
import clsx from 'clsx'
import {
	KBarProvider,
	KBarPortal,
	KBarPositioner,
	KBarAnimator,
	KBarSearch,
	KBarResults,
	useMatches,
	useKBar,
	useRegisterActions,
} from 'kbar'

function Icon({ name, ...props }) {
	const { ...icons } = HeroIcons
	const HeroIcon = icons[name] ? icons[name] : icons['SearchIcon']

	return <HeroIcon {...props} />
}

function RenderResults() {
	const { results } = useMatches()

	return (
		<div className="vtw-pb-2">
			<KBarResults
				items={results}
				onRender={({ item, active }) =>
					typeof item === 'string' ? (
						<p className="vtw-text-[11px] vtw-font-bold vtw-uppercase vtw-h-auto vtw-pt-4 vtw-pb-1 vtw-opacity-50 vtw-px-2">
							{item}
						</p>
					) : (
						<div
							className={clsx(
								'vtw-flex vtw-items-center vtw-gap-2',
								'vtw-text-sm vtw-text-gray-800',
								'vtw-p-2',
								'vtw-mx-2',
								'vtw-rounded-lg',
								active && 'vtw-bg-white/50 vtw-shadow'
							)}
						>
							<div
								className={clsx(
									'vtw-h-5 vtw-w-5',
									active ? 'vtw-text-gray-800' : 'vtw-text-gray-600'
								)}
							>
								<Icon name={item.icon} />
							</div>
							<div className="vtw-flex vtw-flex-col vtw-gap-1">
								<p className="vtw-leading-none vtw-m-0">{item.name}</p>
								{item.subtitle && (
									<p className="vtw-leading-none vtw-text-xs vtw-text-gray-500 vtw-m-0">
										{item.subtitle}
									</p>
								)}
							</div>
						</div>
					)
				}
			/>
		</div>
	)
}

function Portal() {
	const [actions, setActions] = useState([])
	const { query } = useKBar()

	useRegisterActions(actions, [actions])

	useEffect(() => {
		fetch('/actions/palette/actions')
			.then((res) => res.json())
			.then((data) => {
				const actions = data.map((link) => ({
					id: link.url,
					name: link.name,
					icon: link.icon,
					subtitle: link.subtitle,
					section: link.section,
					perform: () => (window.location = link.url),
				}))

				setActions(actions)
			})
	}, [])

	return (
		<>
			<KBarPortal>
				<KBarPositioner className="vtw-backdrop-blur-sm vtw-z-[9999]">
					<KBarAnimator
						className={clsx(
							'vtw-bg-zinc-50',
							'vtw-rounded-lg vtw-overflow-hidden vtw-shadow-xl',
							'vtw-max-w-lg vtw-w-full'
						)}
					>
						<KBarSearch
							className={clsx(
								'vtw-bg-transparent',
								'vtw-w-full',
								'vtw-px-4 vtw-py-3',
								'vtw-border-none',
								'focus:vtw-border-none focus:vtw-outline-none focus:vtw-ring-0'
							)}
						/>
						<RenderResults />
					</KBarAnimator>
				</KBarPositioner>
			</KBarPortal>

			<button
				className="vtw-fixed vtw-bottom-0 vtw-left-0 vtw-mb-4 vtw-flex vtw-items-center vtw-justify-center vtw-ml-4 vtw-bg-zinc-50/70 vtw-backdrop-blur-md vtw-shadow vtw-rounded-full vtw-h-8 vtw-w-8 hover:vtw-bg-zinc-50/90 vtw-z-[9999]"
				onClick={query.toggle}
			>
				<Icon name="TerminalIcon" className="vtw-h-5 vtw-w-5" />
			</button>
		</>
	)
}

export default function Palette() {
	return (
		<KBarProvider>
			<Portal />
		</KBarProvider>
	)
}
