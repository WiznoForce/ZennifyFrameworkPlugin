import { SfdxCommand } from "@salesforce/command";
import { Messages, SfdxProject } from "@salesforce/core";
// import { AnyJson } from "@salesforce/ts-types";

// import { Tooling } from "../../../helpers/tooling";
import { Metadata, CustomObject, CustomField } from "../../../helpers/metadata";

Messages.importMessagesDirectory(__dirname);
const messages = Messages.loadMessages(
  "ZennifyFrameworkCLI",
  "framework.deploy"
);

//TODO: Deploy Custom Metadata Type
//TODO: Deploy Logging Custom Object
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

    console.log("Creating Logging Object");
    await this.createLoggingObject();
  }

  private async createLoggingObject() {
    const loggingObjectApiName: string = "ZennLog__c";

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
}
