import { ErpNextEntityMapModule } from "./types";

export const HR_MAP: ErpNextEntityMapModule = {
  employee: {
    doctype: "Employee",
    fieldMap: { id: "name", display_name: "employee_name", department: "department", designation: "designation", status: "status" },
  },
  leave_application: {
    doctype: "Leave Application",
    fieldMap: { id: "name", employee: "employee", leave_type: "leave_type", from_date: "from_date", to_date: "to_date", status: "status" },
  },
  attendance: {
    doctype: "Attendance",
    fieldMap: { id: "name", employee: "employee", date: "attendance_date", status: "status" },
  },
  salary_slip: {
    doctype: "Salary Slip",
    fieldMap: { id: "name", employee: "employee", status: "status", net_pay: "net_pay", start_date: "start_date", end_date: "end_date" },
  },
  job_opening: {
    doctype: "Job Opening",
    fieldMap: { id: "name", display_name: "job_title", department: "department", status: "status" },
  },
};
