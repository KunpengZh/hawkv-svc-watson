"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailTemplates = void 0;
exports.emailTemplates = {
    onSubmit: {
        subject: (doc) => `NDA + RBA with ${doc.supplierName}`,
        emailBody: (doc, urlLink) => `
        <p>Dear ${doc.requesterName}:</p>
        </br>
        <p>Kindly initiate the RBA and NDA for ${doc.supplierName} with ${doc.IBMEntityName} only</p>
        <br/>
        <p>For reference here the link to the document on the Hawk Visual <a href=${urlLink}>${urlLink}</a></p>
        </br></br>
        <p>Best regards.</p>`
    },
    onAskedMoreInfo: {
        subject: (doc) => `Your NDA + RBA with ${doc.supplierName} been returned for ask more info`,
        emailBody: (doc, urlLink) => `
        <p>Dear ${doc.requesterName}:</p>
        </br>
        <p>Your RBA and NDA for ${doc.supplierName} with ${doc.IBMEntityName} been returned, please provided information as per requested by CoE team and submit it again</p>
        <br/>
        <p>For reference here the link to the document on the Hawk Visual <a href=${urlLink}>${urlLink}</a></p>
        </br></br>
        <p>Best regards.</p>`
    },
    onMarkCompleted: {
        subject: (doc) => `Your NDA + RBA with ${doc.supplierName} been marked as Completed`,
        emailBody: (doc, urlLink) => `
        <p>Dear ${doc.requesterName}:</p>
        </br>
        <p>Your RBA and NDA for ${doc.supplierName} with ${doc.IBMEntityName} been marked as completed</p>
        <br/>
        <p>For reference here the link to the document on the Hawk Visual <a href=${urlLink}>${urlLink}</a></p>
        </br></br>
        <p>Best regards.</p>`
    }
};
