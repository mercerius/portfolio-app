import { vercelAdapter } from "@flags-sdk/vercel";
import { flag } from "flags/next";

export const projectsGridV2Flag = flag<boolean>({
  key: "projects-grid-v2",
  description:
    "A/B test an alternative projects grid and homepage layout aimed at improving project click-through.",
  adapter: vercelAdapter,
  defaultValue: false,
  options: [
    { value: false, label: "Control" },
    { value: true, label: "Projects Grid V2" },
  ],
});
