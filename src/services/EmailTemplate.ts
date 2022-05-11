import { PTTDoc } from "./main";

export const emailTemplates: Record<string, {
    subject: (doc:PTTDoc) => string;
    emailBody: (doc:PTTDoc, urlLink: string) => string;
}> = {
    onSubmit:{
        subject:(doc:PTTDoc)=> `NDA + RBA with ${doc.supplierName}`,
        emailBody:(doc:PTTDoc, urlLink: string)=>`
        <p>Dear ${doc.requesterName}:</p>
        </br>
        <p>Kindly initiate the RBA and NDA for ${doc.supplierName} with ${doc.IBMEntityName} only</p>
        <br/>
        <p>For reference here the link to the document on the Hawk Visual <a href=${urlLink}>${urlLink}</a></p>
        </br></br>
        <p>Best regards.</p>`
    },
    onAskedMoreInfo:{
        subject:(doc:PTTDoc)=> `Your NDA + RBA with ${doc.supplierName} been returned for ask more info`,
        emailBody:(doc:PTTDoc, urlLink: string)=>`
        <p>Dear ${doc.requesterName}:</p>
        </br>
        <p>Your RBA and NDA for ${doc.supplierName} with ${doc.IBMEntityName} been returned, please provided information as per requested by CoE team and submit it again</p>
        <br/>
        <p>For reference here the link to the document on the Hawk Visual <a href=${urlLink}>${urlLink}</a></p>
        </br></br>
        <p>Best regards.</p>`
    },
    onMarkCompleted:{
        subject:(doc:PTTDoc)=> `Your NDA + RBA with ${doc.supplierName} been marked as Completed`,
        emailBody:(doc:PTTDoc, urlLink: string)=>`
        <p>Dear ${doc.requesterName}:</p>
        </br>
        <p>Your RBA and NDA for ${doc.supplierName} with ${doc.IBMEntityName} been marked as completed</p>
        <br/>
        <p>For reference here the link to the document on the Hawk Visual <a href=${urlLink}>${urlLink}</a></p>
        </br></br>
        <p>Best regards.</p>`
    }
}