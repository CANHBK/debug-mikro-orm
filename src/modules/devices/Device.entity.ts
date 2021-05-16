import {
  Cascade,
  Collection,
  Entity,
  Enum,
  OneToMany,
  OneToOne,
  Property,
} from "@mikro-orm/core";
import { Base } from "../../entities/Base";
import { BatteryVoltage } from "../../entities/BatteryVoltage";
import { Environment } from "../../entities/Enviroment";
import { Speed } from "../../entities/Speed";
import { DeviceTemperature, Temperature } from "./DeviceTemperature.entity";
import { Vehicle } from "../vehicles/Vehicle.entity";
import { Location } from "../../entities/Location";
import { Field, InputType, ObjectType, registerEnumType } from "type-graphql";

export enum DeviceState {
  INIT = "init",
  READY = "ready",
  DISCONNECTED = "disconnected",
  SLEEPING = "sleeping",
  LOST = "lost",
  ALERT = "alert",
}

@InputType("DeviceSettingInput")
@ObjectType()
export class DeviceSetting {
  @Field()
  deviceTemperatureFreq: number;
}

registerEnumType(DeviceState, {
  name: "DeviceState",
  description: "Trạng thái thiết bị",
});

@ObjectType()
@Entity()
export class Device extends Base {
  @Property({ unique: true })
  @Field({ description: "Unique Device Identification" })
  udi: string;
  @Property({ nullable: true })
  @Field({ nullable: true, description: "Tên thiết bị" })
  name: string;

  @Enum({ nullable: true, items: () => DeviceState })
  @Field((type) => DeviceState, {
    nullable: true,
    description: "Trạng thái thiết bị",
  })
  state?: DeviceState;

  @Property({ nullable: true })
  @Field({ nullable: true })
  description: string;

  @Property({ nullable: true, type: "jsonb" })
  @Field({ nullable: true })
  settings: DeviceSetting;

  @Property({ nullable: true })
  @Field({ nullable: true })
  homie: string;

  @Property({ nullable: true })
  @Field({ nullable: true })
  implementation: string;

  @Property({ nullable: true })
  @Field({ nullable: true })
  gpsSignal: boolean;

  @Property({ nullable: true, type: "float" })
  @Field({ nullable: true })
  simSignalStrength: number;

  @Property({ nullable: true })
  @Field({ nullable: true })
  simManufacturer: string;

  @Property({ nullable: true })
  @Field({ nullable: true })
  simModel: string;

  @Property({ nullable: true })
  @Field({ nullable: true })
  simImei: string;

  @Enum({ nullable: true, items: () => DeviceState })
  @Field((type) => DeviceState, { nullable: true })
  simState?: DeviceState;

  @OneToOne(() => Vehicle, undefined, { nullable: true })
  @Field(() => Vehicle, { nullable: true })
  vehicle: Vehicle;

  @Field(() => Temperature, {
    description: "Nhiệt độ mới nhất",
    nullable: true,
  })
  lastTemperature?: Temperature;

  @OneToMany(() => DeviceTemperature, (temperature) => temperature.device, {
    nullable: true,
    cascade: [Cascade.ALL],
  })
  @Field(() => [DeviceTemperature])
  temperatures = new Collection<DeviceTemperature>(this);

  @OneToMany(() => Environment, (environment) => environment.device, {
    nullable: true,
    cascade: [Cascade.ALL],
  })
  @Field(() => [Environment])
  enviroments = new Collection<Environment>(this);

  @OneToMany(() => Speed, (speed) => speed.by, {
    nullable: true,
    cascade: [Cascade.ALL],
  })
  @Field(() => [Speed])
  speeds = new Collection<Speed>(this);

  @OneToMany(() => BatteryVoltage, (batteryVoltage) => batteryVoltage.by, {
    nullable: true,
    cascade: [Cascade.ALL],
  })
  @Field(() => [BatteryVoltage])
  batteryVoltages = new Collection<Speed>(this);

  @OneToMany(() => Location, (location) => location.by, {
    nullable: true,
    cascade: [Cascade.ALL],
  })
  @Field(() => [Location])
  locations = new Collection<Location>(this);
}
