export interface PTTDoc {
    _id?:string;
    _rev?:string;
    requestId:string;
    docType:'HawkPTT';
    status: string;
    author:string;
    requesterName: string;
    organizationName: string;
    requesterEmail: string;
    division: string;
    supplierAribaID: string;
    supplierName: string;
    supplierAddress: string;
    supplierWeb: string;
    supplierPoC: string;
    supplierPoCPhone: string;
    supplierPoCEmail: string;
    supplierProdDesc: string;
    purchasingPurpose: string;
    additionalLanguage: string[];
    PAECI: string;
    RBALetterAgreement: boolean;
    isSupplierParentEntity: string[];
    isSupplierOnlyServices: string[];
    isUSFederalSupplier: string[];
    isPIFSupplier: string[];
    SECLA: boolean;
    isSECLAParentEntity: string[];
    EPLA: boolean;
    isEPLALoned: string[];
    EPLAPO: string;
    IEPLA: boolean;
    IBMEntityName: string;
    IBMEntityAddress: string;
}
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
}
export interface PTTEmailParams{
    emailKey:string;
    doc:PTTDoc;
    hostUrlLink:string;
    sender:string;
    receiver:string | string[];
    cc?:string | string[]
}
export interface SubmitParams{
    doc:PTTDoc;
    hostUrlLink:string;
    sender:string;
    receiver:string | string[];
    cc?:string | string[]
}