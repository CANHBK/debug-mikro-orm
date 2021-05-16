import { Entity, ManyToOne, Property } from "@mikro-orm/core";
import { Base } from "./Base";
import { Project } from "./Project";
import { Driver } from "./Driver";
import { Manager } from "./Manager";
import { Field, InputType, ObjectType } from "type-graphql";

@Entity()
@ObjectType()
export class ProjectVehicleAssignment extends Base {
  @Property({ type: "text", nullable: true })
  @Field({ nullable: true })
  notes?: string;

  @ManyToOne(() => Driver)
  @Field(() => Driver)
  driver: Driver;

  @ManyToOne(() => Project, { nullable: true })
  @Field(() => Project, { nullable: true })
  project: Project;

  @ManyToOne(() => Manager)
  @Field(() => Manager)
  createdBy: Manager;

  @ManyToOne(() => Manager)
  @Field(() => Manager)
  updatedBy: Manager;
}
