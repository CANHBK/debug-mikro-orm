import { Entity, ManyToOne } from "@mikro-orm/core";
import { Field, InputType, ObjectType } from "type-graphql";
import { Base } from "./Base";
import { Manager } from "./Manager";
import { Project } from "./Project";

@Entity()
@ObjectType()
export class ManagerProject extends Base {
  @ManyToOne(() => Manager)
  @Field(() => Manager)
  manager: Manager;

  @ManyToOne(() => Project)
  @Field(() => Project)
  project: Project;
}
