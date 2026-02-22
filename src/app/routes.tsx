import { createBrowserRouter } from "react-router";
import { Root } from "./components/Root";
import { Home } from "./components/Home";
import { Admissions } from "./components/Admissions";
import { Accessories } from "./components/Accessories";
import { Attendance } from "./components/Attendance";
import { Homework } from "./components/Homework";
import { Transport } from "./components/Transport";
import { Fees } from "./components/Fees";
import { Exams } from "./components/Exams";
import { NotFound } from "./components/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "admissions", Component: Admissions },
      { path: "accessories", Component: Accessories },
      { path: "attendance", Component: Attendance },
      { path: "homework", Component: Homework },
      { path: "transport", Component: Transport },
      { path: "fees", Component: Fees },
      { path: "exams", Component: Exams },
      { path: "*", Component: NotFound },
    ],
  },
]);
