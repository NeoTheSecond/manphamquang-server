import type { AdminConfig } from "@keystone-6/core/types";
import { CustomNavigation } from "../src/components/CustomNavigation";
export const components: AdminConfig["components"] = {
  Navigation: CustomNavigation,
};
