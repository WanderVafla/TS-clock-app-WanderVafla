import { getRouteApi, Link, useRouter } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { clockChange, clockIn, clockOut } from "#/api/api.clock";
import { ErrorMessageDisplay } from "#/componets/placeholders/ErrorMessageDisplay.tsx";
import { getMessageError } from "#/shared/getMessageError";
import { shallowDiff } from "#/shared/shallowDiff";
import type { ClockChange } from "../../../backend/src/clock/clock.schema";
import type { Entries } from "../../../backend/src/entries/entries.schema";
import type { EntryLabelLink } from "../../../backend/src/entries_labels/entries_labels.schema";
import type { Label } from "../../../backend/src/labels/labels.schema";
import type { Project } from "../../../backend/src/projects/projects.schema";
import { ClockTimer } from "./ClockTimer";
import {
	EntriesIcon,
	LabelsIcon,
	ProjectsIcon,
	StatisticsIcon,
	TimerStatusIcon,
} from "./icons/NavIcons";
import { NextPageIcon } from "./icons/PaginationIcons";
import { LabelPicker } from "./LabelPicker";
import { NotFound } from "./placeholders/NotFound";

const rootRoute = getRouteApi("__root__");

const navItems = [
	{ to: "/entries", label: "Planing", Icon: EntriesIcon },
	{ to: "/projects", label: "Projects", Icon: ProjectsIcon },
	{ to: "/labels", label: "Labels", Icon: LabelsIcon },
	{ to: "/", label: "Statistics", Icon: StatisticsIcon },
] as const;

/*
 * Page links on top, clock button at the bottom (desktop: left column).
 * On phones it becomes a bar at the bottom of the screen, links left, clock right.
 */
export function SideNavigation() {
	const { isClockRunning, projects, labels, lastEntries, entriesLabels } =
		rootRoute.useLoaderData();

	return (
		<aside
			className="
        order-last md:order-0 sticky bottom-2 md:top-3 md:bottom-auto z-10 m-2 md:m-3 [anchor-name:--side-nav]
        md:h-[calc(100dvh-1.5rem)] md:self-start
        flex flex-row md:flex-col items-center justify-between gap-2
        rounded-2xl border border-side-navigation-border bg-side-navigation p-1.5 md:px-2 md:py-4
        shadow-side-navigation md:shadow-none
        "
		>
			<nav
				aria-label="Main"
				className="flex min-w-0 flex-1 flex-row md:flex-none md:flex-col gap-0.5 md:gap-2"
			>
				{navItems.map(({ to, label, Icon }) => (
					<Link
						key={to}
						to={to}
						// "/" would match every page without exact
						activeOptions={{ exact: true }}
						className="
              flex min-h-14 min-w-0 max-w-16 flex-1 md:min-h-16 md:max-w-none md:w-20 md:flex-none flex-col items-center justify-center gap-1
              rounded-xl text-[22px] text-side-navigation-text hover:text-hover-sidebar
              data-[status=active]:bg-side-navigation-active
              data-[status=active]:font-semibold data-[status=active]:text-side-navigation-active-text
              "
					>
						<Icon />
						<span className="text-[11px] md:text-[13px]">{label}</span>
					</Link>
				))}
			</nav>
			<button
				className={`
          grid size-11 shrink-0 cursor-pointer place-items-center rounded-full text-[22px]
          hover:text-hover-sidebar [anchor-name:--clock-btn]
          ${isClockRunning ? "bg-side-navigation-active text-side-navigation-active-text" : "text-side-navigation-text"}
          `}
				type="button"
				popoverTarget="popover"
				aria-label={isClockRunning ? "Open clock (running)" : "Open clock"}
			>
				<TimerStatusIcon />
			</button>
			<ClockPopover
				clockStatus={isClockRunning}
				projects={projects}
				labels={labels}
				lastEntry={lastEntries.data[0]}
				entriesLabels={entriesLabels}
			/>
		</aside>
	);
}

function ClockPopover({
	clockStatus,
	projects,
	labels,
	lastEntry,
	entriesLabels,
}: {
	clockStatus: boolean;
	projects: Project[];
	labels: Label[];
	// undefined while the database has no entry yet
	lastEntry: Entries | undefined;
	entriesLabels: EntryLabelLink[];
}) {
	const router = useRouter();
	const popoverRef = useRef<HTMLElement | null>(null);
	// The entry being timed; undefined when the clock is stopped
	const runningEntry = lastEntry && !lastEntry.end_time ? lastEntry : undefined;
	const clockInAt = runningEntry?.start_time ?? null;

	const currentLabelIds = runningEntry
		? entriesLabels
				.filter((el) => el.time_entry_id === runningEntry.id)
				.map((el) => el.label_id)
		: [];

	const [error, setError] = useState<string | null>(null);
	const [isSubmitting, setSubmitting] = useState(false);

	const [selectedLabelIds, setSelectedLabelIds] =
		useState<number[]>(currentLabelIds);
	const [choisedProjectId, setChoisedId] = useState<number>(
		lastEntry?.project_id ?? 0,
	);
	// Only the running entry's description: a stopped one should not pre-fill the next clock in
	const [description, setDescription] = useState<string | null | undefined>(
		runningEntry?.description,
	);

	const toggleLabel = (id: number) =>
		setSelectedLabelIds((ids) =>
			ids.includes(id) ? ids.filter((i) => i !== id) : [...ids, id],
		);

	const runClockAction = async (action: () => Promise<void>) => {
		setSubmitting(true);
		setError(null);
		try {
			await action();
			popoverRef.current?.hidePopover();
		} catch (e) {
			setError(getMessageError(e));
		} finally {
			setSubmitting(false);
		}
	};

	const handleClock = () =>
		runClockAction(async () => {
			if (clockStatus) {
				await clockOut();
			} else {
				await clockIn({
					project_id: choisedProjectId,
					description: description,
					label: selectedLabelIds,
				});
			}
			await router.invalidate();
		});

	const handleClockSwitch = () =>
		runClockAction(async () => {
			if (!runningEntry) return;
			const initial: ClockChange = {
				project_id: runningEntry.project_id,
				description: runningEntry.description ?? null,
				label: currentLabelIds,
			};
			const changes = shallowDiff<ClockChange>(initial, {
				project_id: choisedProjectId,
				description: description || null,
				label: selectedLabelIds,
			});

			if (Object.keys(changes).length === 0) return;
			await clockChange(changes);
			await router.invalidate();
		});

	return (
		// Phones: full width above the bottom bar. Desktop: next to the clock button.
		<section
			ref={popoverRef}
			id="popover"
			popover="auto"
			aria-busy={isSubmitting}
			onToggle={(e) => {
				if (e.target !== e.currentTarget || e.newState !== "open") return;
				setChoisedId(lastEntry?.project_id ?? 0);
				setDescription(runningEntry?.description);
				setSelectedLabelIds(currentLabelIds);
				setError(null);
			}}
			className="
        [position-anchor:--clock-btn]
        [anchor-name:--clock-popover]
        inset-auto m-0
        left-2 right-2 bottom-[calc(anchor(--side-nav_top)+8px)]
        max-h-[calc(100dvh-6rem)] overflow-y-auto
        md:right-auto md:left-[calc(anchor(--side-nav_right)+12px)] md:bottom-[anchor(bottom)]
        md:max-h-none md:overflow-visible
        md:[position-try-fallbacks:flip-block,flip-inline]
        md:w-90 max-w-full p-4.5
        flex-col gap-3.5 [&:popover-open]:flex
        rounded-[14px] border border-clock-border bg-popover
        shadow-[0_12px_32px_rgba(21,23,28,0.14)]
        aria-busy:cursor-wait
        "
		>
			<ErrorMessageDisplay error={error} />
			{clockInAt && <ClockTimer clockInAt={clockInAt} />}
			<fieldset disabled={isSubmitting} className="contents">
				<fieldset className="flex flex-col gap-1">
					<legend className="mb-1.5 text-[13px] font-medium text-clock-muted">
						Project
					</legend>
					{/* 4 rows max: 4 × h-10 (40px) + 3 × gap-1 (4px) = 172px, the rest scrolls */}
					<div className="flex max-h-43 flex-col gap-1 overflow-y-auto">
						{projects.length > 0 ? (
							projects.map((p) => (
								<label
									key={p.id}
									className="
                flex h-10 shrink-0 items-center justify-between rounded-lg px-2.5 text-sm
                has-checked:bg-clock-selected has-checked:font-semibold has-checked:text-clock-accent
                "
								>
									<span className="flex items-center gap-2.5">
										<input
											type="radio"
											name="clock-project"
											value={p.id}
											checked={p.id === choisedProjectId}
											onChange={() => setChoisedId(p.id)}
											className="size-4.5 accent-clock-accent"
										/>
										{p.name}
									</span>
								</label>
							))
						) : (
							<NotFound />
						)}
					</div>
				</fieldset>

				<fieldset className="flex items-center gap-1.5">
					<legend className="mb-1.5 text-[13px] font-medium text-clock-muted">
						Labels
					</legend>
					{/* One line only: chips that wrap are clipped by max-h-10 (one chip height).
            Chips grow to fill the line, so no white space is left at its end */}
					<div className="flex max-h-10 min-w-0 flex-1 flex-wrap gap-2 overflow-hidden">
						{labels.length > 0 ? (
							labels.slice(0, 4).map((l) => (
								<label
									key={l.id}
									className="
                flex h-10 max-w-full grow cursor-pointer items-center justify-center
                rounded-full border border-clock-border bg-popover px-3.5 text-sm text-clock-muted
                has-checked:border-clock-accent has-checked:bg-clock-selected
                has-checked:font-semibold has-checked:text-clock-accent
                "
								>
									<input
										type="checkbox"
										name="clock-label"
										value={l.id}
										checked={selectedLabelIds.includes(l.id)}
										onChange={() => toggleLabel(l.id)}
										className="sr-only"
									/>
									<span className="truncate">{l.name}</span>
								</label>
							))
						) : (
							<NotFound />
						)}
					</div>
					<button
						type="button"
						popoverTarget="label-picker"
						aria-label="Choose labels"
						className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-clock-border bg-popover text-lg text-clock-muted hover:border-clock-accent"
					>
						<NextPageIcon />
					</button>
					{/* Inside the clock popover, so opening it does not close the clock popover */}
					<LabelPicker
						id="label-picker"
						labels={labels}
						selectedIds={selectedLabelIds}
						onToggle={toggleLabel}
						onClear={() => setSelectedLabelIds([])}
					/>
				</fieldset>

				<textarea
					placeholder="Description"
					className="m-0 rounded-lg bg-gray-50 px-3 py-2.5 text-[13px] text-clock-muted resize-none"
					value={description ?? ""}
					onChange={(e) => setDescription(e.target.value)}
				></textarea>

				<div className="flex gap-2">
					<button
						type="button"
						className="h-11 flex-1 cursor-pointer rounded-[10px] bg-clock-accent text-sm font-semibold text-white"
						onClick={handleClock}
						disabled={choisedProjectId <= 0}
					>
						{!clockStatus ? "Clock In" : "Clock Out"}
					</button>
					<button
						type="button"
						className="h-11 flex-1 cursor-pointer rounded-[10px] border border-clock-border bg-popover text-sm font-medium"
						onClick={handleClockSwitch}
						disabled={!clockStatus || choisedProjectId <= 0}
					>
						Switch now
					</button>
				</div>
			</fieldset>
		</section>
	);
}
