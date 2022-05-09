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
    }
};
