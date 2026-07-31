import { ErpNextEntityMapModule } from "./types";

export const PROJECTS_MAP: ErpNextEntityMapModule = {
  project: {
    doctype: "Project",
    fieldMap: { id: "name", display_name: "project_name", status: "status", percent_complete: "percent_complete" },
  },
  task: {
    doctype: "Task",
    fieldMap: { id: "name", project: "project", subject: "subject", status: "status", assigned_to: "_assign" },
  },
};
