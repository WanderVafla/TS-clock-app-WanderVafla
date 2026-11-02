import { Link } from "@tanstack/react-router";
import { EntriesIcon, TimerStatusIcon } from "./icons/NavIcons";
import { getRouteApi } from "@tanstack/react-router";

const rootRoute = getRouteApi("__root__");

export function SideNavigation() {
  const isClockStatus = rootRoute.useLoaderData()
  
  return (
    <aside className="m-2 p-[1rem_0.50rem] rounded-2xl max-h-dvh flex flex-col justify-between bg-side-navigation shadow-[6px_0_8px_-4px_rgba(0,0,0,0.6)]">
      <nav className="[&_div:hover_svg]:text-hover-sidebar [&_div:hover_p]:text-hover-sidebar flex flex-col gap-2">
        <div>
          <Link
            className="p-2 flex flex-col text-2xl items-center gap-1"
            to="/entries"
          >
            <div>
              <EntriesIcon />
            </div>
            <p className="text-xl">Planing</p>
          </Link>
        </div>
      </nav>
      <div className="[&_div:hover_svg]:size-5 [&_div:hover_svg]:text-hover-sidebar hover_p:text-hover-sidebar p-2 flex flex-col items-center">
        <div
          className="p-2 rounded-2xl cursor-pointer"
          style={isClockStatus ? { background: "gray" } : { background: "none" }}
        >
          <TimerStatusIcon />
        </div>
      </div>
    </aside>
  );
}
