import { SfdxCommand } from "@salesforce/command";
import { Messages, SfdxProject } from "@salesforce/core";
import { exec } from "child_process";
import * as path from "path";
// import { AnyJson } from "@salesforce/ts-types";

// import { Tooling } from "../../../helpers/tooling";
import { Metadata, CustomObject, CustomField } from "../../../helpers/metadata";

const fs = require("fs");

Messages.importMessagesDirectory(__dirname);
const messages = Messages.loadMessages(
  "ZennifyFrameworkCLI",
  "framework.deploy"
);

const __basedir = path.join(__dirname, "../../../../");

//TODO: Deploy ZennQueryBuilder
//TODO: Deploy ZennSObjectDomain
//TODO: Deploy ZennUnitTest

//TODO: Schedulable Batch class to delete Logs after X days - defined in Metadata

//TODO? Add Command to generate triggers+handlers for a list of objects
//TODO? For generated objects, also create Metadata Records for Triggers - default to Active

export default class Deploy extends SfdxCommand {
  public static description = messages.getMessage("commandDescription");

  public static examples = [`$ sfdx zenn:framework:deploy`];

  protected static flagsConfig = {};

  // Comment this out if your command does not require an org username
  protected static requiresUsername = true;

  // Comment this out if your command does not support a hub org username
  protected static supportsDevhubUsername = true;

  // Set this to true if your command requires a project workspace; 'requiresProject' is false by default
  protected static requiresProject = false;

  private connection;
  private metadataHelper: Metadata;

  public async run() {
    this.connection = this.org.getConnection();
    this.metadataHelper = new Metadata(this.connection);

    this.project = await SfdxProject.resolve();

    if (1 > 1) {
      await this.deployLoggingObject();
      await this.deployTriggerCustomMetadataObject();
    }
    this.prototypeExec();
  }

  private async prototypeExec() {
    const repo = "git@github.com:WiznoForce/ZEAF.git";

    const frameworkDirectory = path.join(__basedir, "src", "git");
    const frameworkGitFolderPath = path.join(
      frameworkDirectory,
      "ZennifyFramework2"
    );

    const dir = await fs.promises.opendir(frameworkGitFolderPath);
    console.log(dir);

    console.log("git folder", frameworkGitFolderPath);

    exec(
      `git clone ${repo} ./ZennifyFramework`,
      {
        cwd: frameworkDirectory,
      },
      (err, stdout, stderr) => {
        console.log(err);
        console.log(stdout);
        console.log(stderr);
      }
    );
  }

  private async deployLoggingObject() {
    const loggingObjectApiName: string = "Wizno__ZennLog__c";

    const doesObjectExist: boolean = await this.checkIfObjectExists(
      loggingObjectApiName
    );

    if (doesObjectExist) {
      return;
    }

    const loggingObject: CustomObject = {
      fullName: loggingObjectApiName,
      label: "Zenn Log",
      pluralLabel: "Zenn Logs",
      nameField: {
        type: "AutoNumber",
        label: "Log #",
        startingNumber: 1,
        displayFormat: "Log-{00000}",
      },
      deploymentStatus: "Deployed",
      sharingModel: "ReadWrite",
    };

    const loggingObjectFields: CustomField[] = [
      {
        fullName: `${loggingObjectApiName}.Class__c`,
        type: "Text",
        label: "Class",
        length: 40,
      },
      {
        fullName: `${loggingObjectApiName}.Method__c`,
        type: "Text",
        label: "Method",
        length: 100,
      },
      {
        fullName: `${loggingObjectApiName}.Message__c`,
        type: "LongTextArea",
        label: "Message",
        length: 5000,
        visibleLines: 5,
      },
      {
        fullName: `${loggingObjectApiName}.Stacktrace__c`,
        type: "LongTextArea",
        label: "Stacktrace",
        length: 5000,
        visibleLines: 5,
      },
      {
        fullName: `${loggingObjectApiName}.Endpoint__c`,
        type: "Text",
        label: "Endpoint",
        length: 255,
      },
      {
        fullName: `${loggingObjectApiName}.Request__c`,
        type: "LongTextArea",
        label: "Request",
        length: 5000,
        visibleLines: 5,
      },
      {
        fullName: `${loggingObjectApiName}.Response__c`,
        type: "LongTextArea",
        label: "Response",
        length: 5000,
        visibleLines: 5,
      },
    ];

    const objectResponse = await this.metadataHelper.createObject(
      loggingObject
    );
    console.log(objectResponse);

    const fieldResponse = await this.metadataHelper.createFields(
      loggingObjectFields
    );
    console.log(fieldResponse);
  }

  private async deployTriggerCustomMetadataObject() {
    const customMetadataTypeName: string = "TriggerConfiguration__mdt";

    const doesObjectExist: boolean = await this.checkIfObjectExists(
      customMetadataTypeName
    );

    if (doesObjectExist) {
      return;
    }

    const metadataObject: CustomObject = {
      fullName: customMetadataTypeName,
      label: "Trigger Configuration",
      pluralLabel: "Trigger Configurations",
      description:
        "Stores settings for Triggers, allowing quick & painless disabling of entire triggers or specific events.",
    };

    const metadataObjectFields: CustomField[] = [
      {
        fullName: `${customMetadataTypeName}.IsActive__c`,
        type: "Checkbox",
        label: "Active",
        inlineHelpText: "Is the Trigger Active?",
        defaultValue: "true",
      },
      {
        fullName: `${customMetadataTypeName}.BeforeInsert__c`,
        type: "Checkbox",
        label: "Before Insert",
        inlineHelpText: "Enable Before Insert Event",
        defaultValue: "true",
      },
      {
        fullName: `${customMetadataTypeName}.AfterInsert__c`,
        type: "Checkbox",
        label: "After Insert",
        inlineHelpText: "Enable After Insert Event",
        defaultValue: "true",
      },
      {
        fullName: `${customMetadataTypeName}.BeforeUpdate__c`,
        type: "Checkbox",
        label: "Before Update",
        inlineHelpText: "Enable Before Update Event",
        defaultValue: "true",
      },
      {
        fullName: `${customMetadataTypeName}.AfterUpdate__c`,
        type: "Checkbox",
        label: "After Update",
        inlineHelpText: "Enable After Update Event",
        defaultValue: "true",
      },
      {
        fullName: `${customMetadataTypeName}.BeforeDelete__c`,
        type: "Checkbox",
        label: "Before Delete",
        inlineHelpText: "Enable Before Delete Event",
        defaultValue: "true",
      },
      {
        fullName: `${customMetadataTypeName}.AfterDelete__c`,
        type: "Checkbox",
        label: "After Delete",
        inlineHelpText: "Enable After Delete Event",
        defaultValue: "true",
      },
      {
        fullName: `${customMetadataTypeName}.AfterUndelete__c`,
        type: "Checkbox",
        label: "After Undelete",
        inlineHelpText: "Enable After Undelete Event",
        defaultValue: "true",
      },
    ];

    const objectResponse = await this.metadataHelper.createObject(
      metadataObject
    );
    console.log(objectResponse);

    const fieldResponse = await this.metadataHelper.createFields(
      metadataObjectFields
    );
    console.log(fieldResponse);
  }

  private async checkIfObjectExists(sObjectApiName: string) {
    this.ux.log(`Preparing to Deploy Custom Object: ${sObjectApiName}`);

    this.ux.startSpinner(`Checking if custom object exists.`);
    const doesObjectExist: boolean = await this.metadataHelper.exists(
      "CustomObject",
      sObjectApiName
    );
    this.ux.stopSpinner("Parsing metadata results");

    if (doesObjectExist) {
      this.ux.log(
        `${sObjectApiName} already exists in current org. Moving on!`
      );
    }

    return doesObjectExist;
  }
}
