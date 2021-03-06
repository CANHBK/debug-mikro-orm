import { Entity, ManyToOne, Property } from "@mikro-orm/core";
import { Field, InputType, ObjectType } from "type-graphql";
import { Base } from "./Base";
import { Device } from "../modules/devices/Device.entity";
@Entity()
@ObjectType()
export class Environment extends Base {
  @ManyToOne(() => Device)
  @Field(() => Device)
  device: Device;

  @Property()
  @Field()
  humidity: number;

  @Property()
  @Field()
  temperature: number;

  @ManyToOne(() => Device)
  @Field(() => Device)
  by: Device;
}
