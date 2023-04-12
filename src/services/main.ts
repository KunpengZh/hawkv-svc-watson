export interface AppSequence {
    key: string;
    sequence: string[];
}
export interface QueryParams {
    limit?: number;
    bookmark?: string;
    current?: number;
    direction?: 'next' | 'last';
    [key: string]: any;
    bookmarks?:string[];
}
export interface IFormConfig {
    _id: string;
    _rev: string;
    docType: 'FormBuilder';
    author: string;
    createDate: string;
    editors?: string;
    userGroup?: string[];
    formKey: string | number;
    formName?: string;
    formSize: 'small' | 'large' | 'middle';
    formLayout: 'horizontal' | 'vertical' | 'inline';
    labelCol?: object;
    wrapperCol?: object;
    formSchema: IComponentItem[];
    formStatus: IFormStatus[];
    curStatus: string;
    itemsPerRow: number;
    type: string;
    [key: string]: any
}
interface IComponentItem {
    type: string;
    orderNumber: number | string;
    name: string;
    label?: string;
    width?: number;
    labelCol?: object;
    wrapperCol?: object;
    rules?: any[];
    help?: string;
    hintKey?: string;
    editable?: string[];
    children?: IComponentItem[];
    required?: boolean
    visiable?: string[];
    dataSource?: { label: string; value: any }[];
    disabled?: boolean;

    btnType?: any;
    btnSize?: any;
    btnEvent?: {
        eventList: string[];
        toFormStatus?: string;
        notification?: INotification
    };
    [key: string]: any
}
export interface INotification {
    to: string | string[];
    cc?: string | string[];
    subject: string;
    body: string;
}
interface IFormStatus { title: string; description: string }

export interface IUserGroupDoc {
    _id?: string;
    _rev?: string;
    docType: 'userGroup';
    userGroups: IUserGroup[]
}
export interface IUserGroup {
    key: number | string;
    userGroup: string;
    userList: string;
}

export interface IFormDocument {
    _id?: string;
    _rev?: string;
    docType: 'FormDocument',

    author?: string;
    formKey: string;
    formName: string;
    formId: string;
    createDate: string;

    formDocId: string;
    formDocStatus: string;

    auditTrail?:
    {
        userId?: string;
        date?: string;
        action?: string;
    }[];
    hostUrlLink?: string;

    [key: string]: any
}

