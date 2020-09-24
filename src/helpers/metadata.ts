// import { AnyJson } from "@salesforce/ts-types";

interface CustomObject {
  fullName: string;
  label: string;
  pluralLabel: string;
  nameField?: CustomField;
  description?: string;
  deploymentStatus?: string;
  sharingModel?: string;
}

interface CustomField {
  fullName?: string;
  description?: string;
  fieldManageability?: string;
  type: string;
  label: string;
  TableEnumOrId?: string;
  length?: number;
  visibleLines?: number;
  startingNumber?: number;
  displayFormat?: string;
  inlineHelpText?: string;
  defaultValue?: string;
}

interface MetadataExistsResult {
  apiName: string;
  exists: boolean;
}

class Metadata {
  private connection;

  constructor(connection: any) {
    this.connection = connection;
  }

  public async createObject(objectDefinition: CustomObject) {
    return await this.connection.metadata.create("CustomObject", [
      objectDefinition,
    ]);
  }

  public async createField(fieldDefinition: CustomField) {
    return await this.connection.metadata.create("CustomField", [
      fieldDefinition,
    ]);
  }

  public async createFields(fieldDefinitions: CustomField[]) {
    return await this.connection.metadata.create(
      "CustomField",
      fieldDefinitions
    );
  }

  public async exists(
    metadataType: string,
    metadataApiName: string
  ): Promise<boolean> {
    let metadataResult = await this.connection.metadata.read(metadataType, [
      metadataApiName,
    ]);

    //console.log(metadataResult);

    return !this.isEmpty(metadataResult);
  }

  private isEmpty(objectToTest): boolean {
    if (Object.keys(objectToTest).length === 0) {
      return true;
    }

    return false;
  }
}

export { Metadata, CustomObject, CustomField, MetadataExistsResult };
