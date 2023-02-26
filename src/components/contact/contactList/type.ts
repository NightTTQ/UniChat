// name 为跳转路由名
export type CallbackInfo = {
    labelname: string,
    callback: () => void,
    name: string
}

export enum ChatType {
    FRIENDS,
    GROUP
}