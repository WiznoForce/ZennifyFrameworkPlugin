import { SfdxCommand } from "@salesforce/command";
import { Messages, SfdxProject } from "@salesforce/core";
import { AnyJson } from "@salesforce/ts-types";
//import * as fs from "fs";
import * as path from "path";
// import { promises as fs } from "fs";
// import { constants as fsC } from "fs";

import { Tooling, CustomObject, CustomField } from "../../../helpers/tooling";
// import { exec } from "child_process";

Messages.importMessagesDirectory(__dirname);

const __basedir = path.join(__dirname, "../../../../");

console.log(__basedir);

const messages = Messages.loadMessages("ZennifyFrameworkCLI", "trigger.create");

export default class Create extends SfdxCommand {
  public static description = messages.getMessage("commandDescription");

  public static examples = [`$ sfdx zenn:trigger:create --sobjecttype Account`];

  protected static flagsConfig = {};

  // Comment this out if your command does not require an org username
  protected static requiresUsername = true;

  // Comment this out if your command does not support a hub org username
  protected static supportsDevhubUsername = true;

  // Set this to true if your command requires a project workspace; 'requiresProject' is false by default
  protected static requiresProject = false;

  private connection;
  private toolingHelper: Tooling;

  public async run(): Promise<AnyJson> {
    this.connection = this.org.getConnection();
    this.toolingHelper = new Tooling(this.connection);

    this.project = await SfdxProject.resolve();

    let objectDefinition: CustomObject = {
      description: "Test custom metadata type",
      fullName: "Test2__mdt",
      label: "Test2",
      pluralLabel: "Test2s",
    } as CustomObject;

    if (objectDefinition) {
    }

    let fieldDefinition1: CustomField = {
      type: "Text3",
      label: "Text3 Example",
      fullName: "Test2__mdt.Text_Example3__c",
      length: 80,
    } as CustomField;

    let fieldDefinition2: CustomField = {
      type: "Text2",
      label: "Text2 Example",
      fullName: "Test2__mdt.Text_Example2__c",
      length: 80,
    } as CustomField;

    let defs: Array<CustomField> = [];
    defs.push(fieldDefinition1);
    defs.push(fieldDefinition2);

    //let r = await this.toolingHelper.createObject(objectDefinition);
    //console.log(r);
    let t = await this.toolingHelper.createField(fieldDefinition1);
    console.log(t);
    let t2 = await this.toolingHelper.createField(fieldDefinition2);
    console.log(t2);
    return { x: "something" };
  }
}
