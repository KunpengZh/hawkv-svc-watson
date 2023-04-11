import { byIndex } from "@shared/constants";
import { searchDocumentsPage } from "./SharedSvc";
import type { QueryParams } from "./main";

/**
 * 根据 formKey 来查找 根所这个 template 所创建的文档,分页
 */
export async function loadFormDocList(queryObj: QueryParams) {
    return await searchDocumentsPage(queryObj, byIndex)
}