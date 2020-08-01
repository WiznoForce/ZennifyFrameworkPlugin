import { AnyJson } from "@salesforce/ts-types";

class Tooling {
  private connection;

  constructor(connection: any) {
    this.connection = connection;
  }

  public async createClass(body: string): Promise<AnyJson> {
    let config = {
      body: body,
    };

    /* const createResult = await this.connection.tooling
      .sobject(apexType)
      .create(config);

		return createResult; */

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

    /* const createResult = await this.connection.tooling
			.sobject(apexType)
			.create(config); */

    //return createResult;
    return await this.createApex("AoexTrigger", config);
  }

  private async createApex(apexType: string, config: any) {
    return await this.connection.tooling.sobject(apexType).create(config);
  }
}

export { Tooling };
