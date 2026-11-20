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
	TimerStatusIcon,
} from "./icons/NavIcons";
import { NextPageIcon } from "./icons/PaginationIcons";
import { LabelPicker } from "./LabelPicker";
import { NotFound } from "./placeholders/NotFound";

const rootRoute = getRouteApi("__root__");
export function SideNavigation() {
	const { isClockRunning, projects, labels, lastEntries, entriesLabels } =
		rootRoute.useLoaderData();

	return (
		<aside className="order-last md:order-0 sticky bottom-2 z-10 m-2 p-[0.25rem_1rem] md:p-[1rem_0.50rem] rounded-2xl md:max-h-dvh flex flex-row md:flex-col items-center md:items-stretch justify-between bg-side-navigation shadow-[0_-6px_8px_-4px_rgba(0,0,0,0.6)] md:shadow-[6px_0_8px_-4px_rgba(0,0,0,0.6)]">
			<nav className="[&_div:hover_svg]:text-hover-sidebar [&_div:hover_p]:text-hover-sidebar flex flex-row md:flex-col gap-2">
				<div>
					<Link
						className="p-1 md:p-2 flex flex-col text-2xl items-center gap-1"
						to="/entries"
					>
						<div>
							<EntriesIcon />
						</div>
						<p className="text-xs md:text-xl">Planing</p>
					</Link>
				</div>
				<div>
					<Link
						className="p-1 md:p-2 flex flex-col text-2xl items-center gap-1"
						to="/projects"
					>
						<div>
							<ProjectsIcon />
						</div>
						<p className="text-xs md:text-xl">Projects</p>
					</Link>
				</div>
				<div>
					<Link
						className="p-1 md:p-2 flex flex-col text-2xl items-center gap-1"
						to="/labels"
					>
						<div>
							<LabelsIcon />
						</div>
						<p className="text-xs md:text-xl">Labels</p>
					</Link>
				</div>
			</nav>
			<div className="[&_button:hover_svg]:size-5 [&_button:hover_svg]:text-hover-sidebar hover_p:text-hover-sidebar p-2 flex flex-col items-center">
				<button
					className="p-2 rounded-2xl cursor-pointer [anchor-name:--clock-btn]"
					type="button"
					popoverTarget="popover"
					aria-label="Open clock"
					style={
						isClockRunning ? { background: "gray" } : { background: "none" }
					}
				>
					<TimerStatusIcon />
				</button>
			</div>
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
        left-[calc(anchor(right)+12px)]
        bottom-[anchor(bottom)]
        [position-try-fallbacks:flip-block,flip-inline]
        w-90 max-w-full p-4.5
        flex-col gap-3.5 [&:popover-open]:flex
        rounded-[14px] border border-[#e1e4ea] bg-white text-[#15171c]
        shadow-[0_12px_32px_rgba(21,23,28,0.14)]
        aria-busy:cursor-wait
        "
		>
			<ErrorMessageDisplay error={error} />
			{clockInAt && <ClockTimer clockInAt={clockInAt} />}
			<fieldset disabled={isSubmitting} className="contents">
				<fieldset className="flex flex-col gap-1">
					<legend className="mb-1.5 text-[13px] font-medium text-[#3f4654]">
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
                has-checked:bg-[#e8edfb] has-checked:font-semibold has-checked:text-[#1a3596]
                "
								>
									<span className="flex items-center gap-2.5">
										<input
											type="radio"
											name="clock-project"
											value={p.id}
											checked={p.id === choisedProjectId}
											onChange={() => setChoisedId(p.id)}
											className="size-4.5 accent-[#2449c9]"
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
					<legend className="mb-1.5 text-[13px] font-medium text-[#3f4654]">
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
                rounded-full border border-[#c9ced8] bg-white px-3.5 text-sm text-[#3f4654]
                has-checked:border-[#2449c9] has-checked:bg-[#e8edfb]
                has-checked:font-semibold has-checked:text-[#1a3596]
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
						className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-[#c9ced8] bg-white text-lg text-[#3f4654] hover:border-[#2449c9]"
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
					className="m-0 rounded-lg bg-[#f7f8fa] px-3 py-2.5 text-[13px] text-[#3f4654] resize-none"
					value={description ?? ""}
					onChange={(e) => setDescription(e.target.value)}
				></textarea>

				<div className="flex gap-2">
					<button
						type="button"
						className="h-11 flex-1 cursor-pointer rounded-[10px] bg-[#2449c9] text-sm font-semibold text-white"
						onClick={handleClock}
						disabled={choisedProjectId <= 0}
					>
						{!clockStatus ? "Clock In" : "Clock Out"}
					</button>
					<button
						type="button"
						className="h-11 flex-1 cursor-pointer rounded-[10px] border border-[#c9ced8] bg-white text-sm font-medium"
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
