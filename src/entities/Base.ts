import { PrimaryKey, Property } from "@mikro-orm/core";
import { IResource } from "@root/resolvers/BaseResolver";
import { Field, Int, ObjectType } from "type-graphql";

@ObjectType({ isAbstract: true })
export class Base implements IResource {
  // TODO: custom name createdAt sẽ crash `Error: Trying to query by not existing property DeviceTemperature.createdAt`
  @Property({ type: "date", defaultRaw: "now()" })
  private createdAt: string;

  @Property({
    type: "date",
    onUpdate: () => new Date(),
    defaultRaw: "now()",
    fieldName: "updated_at",
  })
  private _updatedAt = new Date();

  @Field(() => Int)
  @PrimaryKey()
  id!: number;

  @Field(() => String, { name: "createdAt" })
  get _createdAt(): string {
    return new Date(this.createdAt).toUTCString();
  }

  @Field(() => String)
  get updatedAt(): string {
    return new Date(this._updatedAt).toUTCString();
  }
}
