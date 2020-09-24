import { flags, SfdxCommand } from "@salesforce/command";
import { Messages, SfdxError, SfdxProject } from "@salesforce/core";
import { AnyJson } from "@salesforce/ts-types";
//import * as fs from "fs";
import * as path from "path";
import { promises as fs } from "fs";
import { constants as fsC } from "fs";

import { Tooling } from "../../../helpers/tooling";
import { exec } from "child_process";

Messages.importMessagesDirectory(__dirname);

const __basedir = path.join(__dirname, "../../../../");

console.log(__basedir);

const messages = Messages.loadMessages("ZennifyFrameworkCLI", "trigger.create");

const TRIGGER_NAME_SUFFIX = "Trigger";
const TRIGGER_HANDLER_NAME_SUFFIX = "TriggerHandler";

interface CreateResponse {
  ApexTrigger?: any;
  ApexClass?: any;
}

export default class Create extends SfdxCommand {
  public static description = messages.getMessage("commandDescription");

  public static examples = [`$ sfdx zenn:trigger:create --sobjecttype Account`];

  protected static flagsConfig = {
    sobjecttype: flags.string({
      char: "s",
      description: messages.getMessage("nameFlagDescription"),
      required: true,
    }),
    events: flags.array({
      char: "e",
      description: messages.getMessage("eventFlagDescription"),
      options: [
        "BEFORE_INSERT",
        "AFTER_INSERT",
        "AFTER_INSERT",
        "AFTER_UPDATE",
        "BEFORE_DELETE",
        "AFTER_DELETE",
        "AFTER_UNDELETE",
      ],
    }),
    notrigger: flags.boolean({
      description: messages.getMessage("notriggerFlagDescription"),
    }),
    nohandler: flags.boolean({
      description: messages.getMessage("nohandlerFlagDescription"),
    }),
  };

  // Comment this out if your command does not require an org username
  protected static requiresUsername = true;

  // Comment this out if your command does not support a hub org username
  protected static supportsDevhubUsername = true;

  // Set this to true if your command requires a project workspace; 'requiresProject' is false by default
  protected static requiresProject = false;

  private connection;
  //private project: SfdxProject;
  private sObjectType: string;

  private triggerFileName: string;
  private triggerHandlerFileName: string;
  private triggerEvents: string;

  private isCreatingTrigger: boolean;
  private isCreatingTriggerHandler: boolean;

  private toolingHelper;

  public async run(): Promise<CreateResponse> {
    this.connection = this.org.getConnection();
    this.toolingHelper = new Tooling(this.connection);

    this.project = await SfdxProject.resolve();
    console.log(this.project);

    this.generateManifest();

    this.parseTriggerEventsFlag();
    this.sObjectType = this.flags.sobjecttype;
    this.isCreatingTrigger = !this.flags.notrigger;
    this.isCreatingTriggerHandler = !this.flags.nohandler;

    console.log("trigger: ", this.isCreatingTrigger);
    console.log("handler: ", this.isCreatingTriggerHandler);

    this.setTriggerFileName();
    this.setTriggerHandlerFileName();

    const doesTriggerExist = await this.hasTrigger();

    if (doesTriggerExist) {
      throw new SfdxError(
        `Trigger already exists. sObject: ${this.sObjectType} Trigger: ${this.triggerFileName}`
      );
    }

    const doesHandlerExist = await this.hasApexClass(
      this.triggerHandlerFileName
    );

    const doesFrameworkExist = await this.hasApexClass("ZennSObjectDomain");

    if (doesFrameworkExist) {
      this.ux.log("Framework exists");
    } else {
      throw new SfdxError(
        "Cannot create Trigger without supporting Framework Classes. Please run sfdx zenn:framework:deploy"
      );
    }

    const triggerBody: string = await this.generateTriggerFromTemplate();
    const triggerHandlerBody: string = await this.generateTriggerHandlerFromTemplate();

    let responseWrapper: CreateResponse = {};

    if (!doesHandlerExist && this.isCreatingTriggerHandler) {
      const handlerResponse = await this.createApex(
        "ApexClass",
        triggerHandlerBody
      );
      responseWrapper.ApexClass = handlerResponse;
      console.log(handlerResponse);

      /* let filePath = path.join(
        this.project.getPath(),
        "force-app",
        "main",
        "default",
        "classes",
        this.triggerHandlerFileName + ".class"
      );
      console.log(filePath);
      exec(
        `sfdx force:source:retrieve --sourcepath "${filePath}"`,
        {
          cwd: this.project.getPath(),
        },
        function (err, stdout, stderr) {
          console.log(err);
          console.log(stdout);
          console.log(stderr);
        }
      ); */
    }

    if (!doesTriggerExist && this.isCreatingTrigger) {
      const triggerResponse = await this.createApex("ApexTrigger", triggerBody);
      responseWrapper.ApexTrigger = triggerResponse;
      console.log(triggerResponse);

      /* let filePath = path.join(
        this.project.getPath(),
        "force-app",
        "main",
        "default",
        "triggers",
        this.triggerFileName + ".trigger"
      );
      console.log(filePath);
      exec(
        `sfdx force:source:retrieve --sourcepath "${filePath}"`,
        {
          cwd: this.project.getPath(),
        },
        function (err, stdout, stderr) {
          console.log(err);
          console.log(stdout);
          console.log(stderr);
        }
      ); */
    }

    let filePath = path.join(
      this.project.getPath(),
      "manifest",
      "ZennTools.xml"
    );
    console.log(filePath);
    exec(
      `sfdx force:source:retrieve --manifest "${filePath}"`,
      {
        cwd: this.project.getPath(),
      },
      function (err, stdout, stderr) {
        console.log(err);
        console.log(stdout);
        console.log(stderr);
      }
    );

    //console.log(triggerBody);
    //console.log(triggerHandlerBody);

    console.log(responseWrapper);

    return responseWrapper;
  }

  private setTriggerFileName() {
    this.triggerFileName = this.normalizeCustomObject() + TRIGGER_NAME_SUFFIX;
  }

  private setTriggerHandlerFileName() {
    this.triggerHandlerFileName =
      this.normalizeCustomObject() + TRIGGER_HANDLER_NAME_SUFFIX;
  }

  private normalizeCustomObject(): string {
    const OBJECT_SUFFIX = "__c";
    let normalizedObjectName = this.sObjectType.replace(OBJECT_SUFFIX, "");
    normalizedObjectName = normalizedObjectName.replace(/_/g, "");

    return normalizedObjectName;
  }

  private parseTriggerEventsFlag() {
    const triggerEvents: Array<string> = this.flags.events || [
      "BEFORE_INSERT",
      "AFTER_INSERT",
    ];

    let triggerEventString: string = triggerEvents.join(", ");
    triggerEventString = triggerEventString.toLowerCase();
    triggerEventString = triggerEventString.replace(/_/g, " ");

    this.triggerEvents = triggerEventString;
  }

  private async hasTrigger(): Promise<boolean> {
    this.ux.startSpinner(
      `Checking if ${this.triggerFileName} exists on ${this.sObjectType}`
    );

    const triggerQuery = await this.connection.tooling
      .sobject("ApexTrigger")
      .find({ TableEnumOrId: this.sObjectType, Name: this.triggerFileName }, [
        "Name",
        "TableEnumOrId",
      ]);

    this.ux.stopSpinner("Parsing results");

    return triggerQuery.length == 1;
  }

  private async hasApexClass(fileName: string): Promise<boolean> {
    this.ux.startSpinner(`Querying for Apex Class: ${fileName}`);

    const apexQuery = await this.connection.tooling
      .sobject("ApexClass")
      .find({ Name: fileName }, ["Name"]);

    this.ux.stopSpinner("Parsing query results");

    return apexQuery.length == 1;
  }

  private async generateTriggerFromTemplate(): Promise<string> {
    const frameworkDirectory = path.join(
      __basedir,
      "src",
      "templates",
      "trigger"
    );
    const triggerClass = `${frameworkDirectory}/Trigger.trigger`;

    let apexBody = await fs.readFile(triggerClass, "utf8");

    apexBody = apexBody
      .replace(/TRIGGER_FILENAME/g, this.triggerFileName)
      .replace(/TRIGGER_HANDLER_FILENAME/g, this.triggerHandlerFileName)
      .replace(/TRIGGER_SOBJECT/g, this.sObjectType)
      .replace(/TRIGGER_EVENTS/g, this.triggerEvents);

    //console.log(apexBody);

    return apexBody;
  }

  private async generateTriggerHandlerFromTemplate(): Promise<string> {
    const frameworkDirectory = path.join(
      __basedir,
      "src",
      "templates",
      "class"
    );
    const handlerClass = `${frameworkDirectory}/TriggerHandler.cls`;

    let apexBody = await fs.readFile(handlerClass, "utf8");

    apexBody = apexBody
      .replace(/TRIGGER_FILENAME/g, this.triggerFileName)
      .replace(/TRIGGER_HANDLER_FILENAME/g, this.triggerHandlerFileName)
      .replace(/TRIGGER_SOBJECT/g, this.sObjectType)
      .replace(/TRIGGER_EVENTS/g, this.triggerEvents);

    //console.log(apexBody);
    return apexBody;
  }

  private async generateManifest() {
    const fileReadPath = path.join(
      __basedir,
      "src",
      "templates",
      "manifest",
      "ZennTools.xml"
    );

    let fileBody = await fs.readFile(fileReadPath, "utf8");
    if (fileBody) {
      //
    }

    const fileWritePath = path.join(
      this.project.getPath(),
      "manifest",
      "ZennTools.xml"
    );

    //TODO - check if file exists first
    let doesManifestExist;
    try {
      doesManifestExist = await fs.access(fileWritePath, fsC.F_OK | fsC.R_OK);
      console.log("Write path:", fileWritePath);
      console.log("Does the file exist?", doesManifestExist);
    } catch (e) {
      const writeResult = fs.writeFile(fileWritePath, fileBody);
      console.log(writeResult);
    }
  }

  private async createApex(apexType: string, body: string): Promise<AnyJson> {
    let config = {
      body: body,
      TableEnumOrId: null,
    };

    if (apexType == "ApexTrigger") {
      config.TableEnumOrId = this.sObjectType;
    } else {
      delete config.TableEnumOrId;
    }

    const createResult = await this.connection.tooling
      .sobject(apexType)
      .create(config);

    //    console.log(createResult);
    return createResult;

    return await this.toolingHelper.createTrigger(this.sObjectType, body);
  }
}
