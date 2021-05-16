import { Entity, ManyToOne, Property } from "@mikro-orm/core";
import { Field, InputType, ObjectType } from "type-graphql";
import { Base } from "../../entities/Base";
import { Device } from "./Device.entity";

@ObjectType()
export class Temperature extends Base {
  @Property()
  @Field()
  temperature: number;
}

@Entity()
@ObjectType()
export class DeviceTemperature extends Temperature {
  @ManyToOne(() => Device)
  @Field(() => Device)
  device: Device;
}
