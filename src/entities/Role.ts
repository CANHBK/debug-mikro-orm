import { Collection, Entity, ManyToMany, Property } from "@mikro-orm/core";
import { Base } from "./Base";
import { Account } from "../modules/accounts/Account.entity";
import { Field, InputType, ObjectType } from "type-graphql";
import { Permission } from "./Permission";

@Entity()
@ObjectType()
export class Role extends Base {
  @Property({ unique: true })
  @Field()
  name: string;

  @Property({ nullable: true })
  @Field({ nullable: true })
  description?: string;

  @Property({ default: false })
  @Field()
  isNominal: boolean;

  @ManyToMany(() => Account, (account) => account.roles)
  @Field(() => [Account])
  accounts = new Collection<Account>(this);

  @ManyToMany(() => Permission, (permission) => permission.roles, {
    owner: true,
  })
  @Field(() => [Permission])
  permissions = new Collection<Permission>(this);
}
