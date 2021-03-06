import {
  Cascade,
  Collection,
  Entity,
  ManyToOne,
  OneToMany,
  Property,
} from "@mikro-orm/core";
import { Field, InputType, ObjectType } from "type-graphql";
import { Account } from "../modules/accounts/Account.entity";
import { Base } from "./Base";
import { NotificationGroup } from "./NotificationGroup";

@ObjectType()
@Entity()
export class AccountNotificationGroup extends Base {
  @Property()
  @Field()
  enable: boolean;

  @ManyToOne(() => Account)
  @Field(() => Account)
  account: Account;

  @Field(() => NotificationGroup)
  @ManyToOne(() => NotificationGroup)
  notificationGroup: NotificationGroup;
}
