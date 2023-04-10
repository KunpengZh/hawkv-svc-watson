import { IClientData } from "@shared/JwtService";
import ResponseWarp from "@shared/ResponseWarp";
import CacheServices from "@shared/CacheServices";
import { queryByDocId, searchAllDocuments } from "./SharedSvc";
import { USER_GROUP_DOC_ID, byIndex, docTypes } from "@shared/constants";
import { IFormConfig, IUserGroupDoc } from "./main";

/**
 * 获取所有的 Forms Tempalte  docType="FormBuilder"
 * 检查当用户所属的 userGroup 是有权限访问的 Doc 的列表
 */
export async function loadFormTemplateList(userData: IClientData) {
    const { email } = userData;
    // 获取用户权限定义,如果没有用户权限定义,直接返回空数组
    let userGroupDoc: IUserGroupDoc = CacheServices.get('userGroupDoc');
    if (!userGroupDoc) {
        try {
            const response = await queryByDocId(USER_GROUP_DOC_ID);
            if (response.code !== 200) {
                return ResponseWarp.successX([], 'userGroup does not exist')
            }
            userGroupDoc = response.data.doc;
            CacheServices.set('userGroupDoc', userGroupDoc);
        } catch (err) {
            return ResponseWarp.successX([], 'userGroup does not exist')
        }
    }

    // 获取所有的 Forms Template
    const response = await searchAllDocuments({ docType: docTypes.FormBuilder }, byIndex);
    if (response.code !== 200) {
        return ResponseWarp.err(404, 'Form Templates not find')
    }
    const { docs = [] } = response.data;

    const formLists: IFormConfig[] = docs.filter((doc: IFormConfig) => {
        const { author, userGroup: authorizedUserGroups = [], editors = '' } = doc;
        if ((author + editors).includes(email)) {
            return true;
        }
        for (let userGroup of authorizedUserGroups) {
            const authorizedUsers = userGroupDoc.userGroups.find(ug => ug.userGroup === userGroup)?.userList || '';
            return authorizedUsers.includes(email)
        }
        return false;
    });

    return ResponseWarp.successX({ docs: formLists });

}