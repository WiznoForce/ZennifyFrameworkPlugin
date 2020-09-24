import { AnyJson } from "@salesforce/ts-types";

/* interface CustomObject {
  fullName: string;
  label: string;
  pluralLabel: string;
  nameField: CustomField;
  description?: string;
}

interface CustomField {
  fullName: string;
  description?: string;
  fieldManageability: string;
  type: string;
  label: string;
  TableEnumOrId: string;
  length: number;
} */

/* interface CustomObject {
  Description?: string;
  DeveloperName?: string;
  ManageableState?: string;
} */

/* interface CustomField {
  DeveloperName?: string;
  ManageableState?: string;
  Metadata?: CustomFieldMetadata;
  TableEnumOrId?: string;
} */

/* interface CustomFieldMetadata {
  caseSensitive?: boolean;
  defaultValue?: string;
  //deleteConstraint?: DeleteConstraint; //{SetNull,Restrict,Cascade}
  description?: string;
  label?: string;
  length?: string;
  required?: boolean;
  type?: string;
  unique?: string;
} */

class Tooling {
  private connection;

  constructor(connection: any) {
    this.connection = connection;
  }

  /* public async createObject(objectDefinition: CustomObject) {
    return await this.connection.metadata.create("CustomObject", [
      objectDefinition,
    ]);
  }

  public async createField(fieldDefinition: CustomField) {
    return await this.connection.metadata.create("CustomField", [
      fieldDefinition,
    ]);
  } */

  public async createClass(body: string): Promise<AnyJson> {
    let config = {
      body: body,
    };

    return await this.createApex("ApexClass", config);
  }

  public async createTrigger(
    sObjectType: string,
    body: string
  ): Promise<AnyJson> {
    let config = {
      body: body,
      TableEnumOrId: sObjectType,
    };

    return await this.createApex("AoexTrigger", config);
  }

  private async createApex(apexType: string, config: any) {
    return await this.connection.tooling.sobject(apexType).create(config);
  }
}

//export { Tooling, CustomObject, CustomField, CustomFieldMetadata };
export { Tooling };
