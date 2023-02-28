import { Group, Contact } from "@/types";

export  type Info = ( Group | Contact )  & { type: "friend" | "group" };


// {labelname} 标签名
// key 在 info 中的key值
export type Label<T> = {
    labelname: string,
    key: keyof T
}