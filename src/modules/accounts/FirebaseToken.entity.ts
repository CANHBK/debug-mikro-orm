import { Entity, ManyToOne, Property } from "@mikro-orm/core";
import { Base } from "@root/entities/Base";
import { extend } from "lodash";
import { Field, ObjectType } from "type-graphql";
import { Account } from "./Account.entity";

@Entity()
@ObjectType()
export class FirebaseToken extends Base {
  @Field()
  @Property()
  token: string;

  @ManyToOne(() => Account)
  account: Account;
}
