import {
  Cascade,
  Collection,
  Entity,
  OneToMany,
  Property,
} from "@mikro-orm/core";
import { Field, ObjectType, InputType } from "type-graphql";
import { Base } from "./Base";
import { Vehicle } from "../modules/vehicles/Vehicle.entity";

@ObjectType()
@Entity()
export class Manufacturer extends Base {
  @Field()
  @Property({ unique: true })
  name: string;

  @OneToMany(() => Vehicle, (vehicle) => vehicle.manufacturer, {
    cascade: [Cascade.ALL],
  })
  @Field(() => [Vehicle])
  vehicles = new Collection<Vehicle>(this);
}
