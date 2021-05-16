import { Collection, Entity, ManyToMany, Property } from "@mikro-orm/core";
import { Base } from "./Base";
import { Field, InputType, ObjectType } from "type-graphql";
import { Role } from "./Role";

@Entity()
@ObjectType()
export class Permission extends Base {
  @Property()
  @Field()
  name: string;
  @Property({ unique: true })
  @Field()
  code: string;
  @Property({ nullable: true })
  @Field({ nullable: true })
  description?: string;

  @ManyToMany(() => Role, (role) => role.permissions)
  @Field(() => [Role])
  roles = new Collection<Role>(this);
}
