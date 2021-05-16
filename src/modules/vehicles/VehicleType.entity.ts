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
import { Vehicle } from "./Vehicle.entity";

@ObjectType()
@Entity()
@Unique({ properties: ["name"] })
export class VehicleType extends Base {
  @Field()
  @Property()
  name: string;

  @OneToMany(() => Vehicle, (vehicle) => vehicle.type, {
    cascade: [Cascade.ALL],
  })
  @Field(() => [Vehicle])
  vehicles = new Collection<Vehicle>(this);
}
