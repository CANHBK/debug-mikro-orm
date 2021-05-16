import {
  Cascade,
  Collection,
  Entity,
  OneToMany,
  Property,
  Unique,
} from "@mikro-orm/core";
import { Field, ObjectType, InputType } from "type-graphql";
import { Base } from "../../entities/Base";
import { Vehicle } from "../vehicles/Vehicle.entity";

@ObjectType()
@Entity()
export class Fuel extends Base {
  @Field()
  @Property({ unique: true })
  name!: string;

  @OneToMany(() => Vehicle, (vehicle) => vehicle.fuel, {
    cascade: [Cascade.ALL],
  })
  @Field(() => [Vehicle])
  vehicles = new Collection<Vehicle>(this);
}
