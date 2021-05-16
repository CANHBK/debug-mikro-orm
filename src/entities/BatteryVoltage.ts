import { Entity, ManyToOne, Property } from "@mikro-orm/core";
import { Field, InputType, ObjectType } from "type-graphql";
import { Base } from "./Base";
import { Device } from "../modules/devices/Device.entity";
import { Vehicle } from "../modules/vehicles/Vehicle.entity";

@Entity()
@ObjectType()
export class BatteryVoltage extends Base {
  @ManyToOne(() => Vehicle)
  @Field(() => Vehicle)
  vehicle: Vehicle;

  @Property()
  @Field()
  voltage: number;

  @ManyToOne(() => Device)
  @Field(() => Device)
  by: Device;
}
