import { Link } from "@tanstack/react-router";
import { EntriesIcon, LabelsIcon, ProjectsIcon, TimerStatusIcon } from "./icons/NavIcons";
import { getRouteApi } from "@tanstack/react-router";

const rootRoute = getRouteApi("__root__");

export function SideNavigation() {
  const isClockStatus = rootRoute.useLoaderData();

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
      <div className="[&_div:hover_svg]:size-5 [&_div:hover_svg]:text-hover-sidebar hover_p:text-hover-sidebar p-2 flex flex-col items-center">
        <div
          className="p-2 rounded-2xl cursor-pointer"
          style={
            isClockStatus ? { background: "gray" } : { background: "none" }
          }
        >
          <TimerStatusIcon />
        </div>
      </div>
    </aside>
  );
}
