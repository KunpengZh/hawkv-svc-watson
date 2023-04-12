import { byIndex } from "@shared/constants";
import { saveOrUpdateDoc, searchDocumentsPage } from "./SharedSvc";
import type { IFormDocument, QueryParams, INotification } from "./main";
import { sendNotificationEmail } from './BlueMailSvc';
import dayjs from "dayjs";


/**
 * 根据 formKey 来查找 根所这个 template 所创建的文档,分页
 */
export async function loadFormDocList(queryObj: QueryParams) {
    return await searchDocumentsPage(queryObj, byIndex)
}

/**
 * 发送邮件并保存表单
 */
export async function sendNotificationAndSave(props: {
    formDocument: IFormDocument,
    notification: INotification
}) {
    const { formDocument, notification } = props;
    const emailRes = await sendNotificationEmail({
        ...notification,
        sender: 'HawkVisual@cn.ibm.com'
    });

    const { auditTrail = [] } = formDocument;

    if (emailRes.code !== 200) {
        auditTrail.push({
            userId: 'Hawk Visual Services ID',
            date: dayjs().format('YYYY-HH-mm HH:mm:ss'),
            action: `Notificatin failed -- ${notification.subject}`
        });
        formDocument.auditTrail = auditTrail;
    } else {
        auditTrail.push({
            userId: 'Hawk Visual Services ID',
            date: dayjs().format('YYYY-HH-mm HH:mm:ss'),
            action: `Notificatin successed -- ${notification.subject}`
        });
        formDocument.auditTrail = auditTrail;
    }

    return await saveOrUpdateDoc(formDocument);



}