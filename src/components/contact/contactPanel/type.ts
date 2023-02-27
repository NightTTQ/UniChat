import { Group, Contact } from "@/types";

export  type Info = ( Group | Contact )  & { type: "friend" | "group" };
