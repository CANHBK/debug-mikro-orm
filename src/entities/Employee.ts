import {
  Cascade,
  Collection,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  Property,
} from "@mikro-orm/core";
import { Field, InputType, InterfaceType, ObjectType } from "type-graphql";
import { Account } from "../modules/accounts/Account.entity";
import { Base } from "./Base";
import { Driver } from "./Driver";
import { Issue } from "./Issue";
import { Manager } from "./Manager";
@InputType("PlaceInput")
@ObjectType()
export class Place {
  @Field()
  province: string;

  @Field()
  district: string;

  @Field()
  village: string;
}

@InterfaceType({
  resolveType: (value) => value.constructor.name,
})
export abstract class IEmployee {
  @Field()
  name: string;
  @Field()
  email: string;

  @Field({ nullable: true })
  phone?: string;

  @Field({ nullable: true })
  address?: string;

  @Field({ nullable: true })
  dateOfBirth?: string; // validate dd-mm-yyyy or dd/mm/yyyy

  @Field({ nullable: true })
  salary?: number;

  @Field({ nullable: true })
  unit?: string;

  @Field(() => String, { nullable: true })
  startWork?: Date;

  @Field(() => String, { nullable: true })
  endWork?: Date;
}

@ObjectType({ implements: IEmployee })
@Entity()
export class Employee extends Base implements IEmployee {
  @Field()
  @Property()
  name: string;

  @Field()
  @Property()
  email: string;

  @Field({ nullable: true })
  @Property({ nullable: true })
  phone?: string;

  @Field({ nullable: true })
  @Property({ columnType: "jsonb", nullable: true })
  address?: string;

  @Field({ nullable: true })
  @Property({ nullable: true })
  dateOfBirth?: string; // validate dd-mm-yyyy or dd/mm/yyyy

  @Field({ nullable: true })
  @Property({ nullable: true })
  salary?: number;

  @Field({ nullable: true })
  @Property({ nullable: true })
  unit?: string;

  @Field(() => String, { nullable: true })
  @Property({ type: "date", nullable: true })
  startWork?: Date;

  @Field(() => String, { nullable: true })
  @Property({ type: "date", nullable: true })
  endWork?: Date;

  @Field(() => Driver, { nullable: true })
  @OneToOne(() => Driver, (driver) => driver.employee, { nullable: true })
  driver: Driver;

  @Field(() => Manager, { nullable: true })
  @OneToOne(() => Manager, (manager) => manager.employee, { nullable: true })
  manager: Manager;

  @Field(() => Account, { nullable: true })
  @OneToOne(() => Account, (account) => account.employee)
  account?: Account;

  @Field(() => Issue, { nullable: true })
  @ManyToMany(() => Issue, (issue) => issue.assignees, { nullable: true })
  issues: Issue;
}
