import {
  Cascade,
  Collection,
  Entity,
  ManyToMany,
  OneToMany,
  OneToOne,
  Property,
} from "@mikro-orm/core";
import { getImage } from "@root/utils/imageHandler";
import { Field, InputType, ObjectType } from "type-graphql";
import { Base } from "../../entities/Base";
import { Driver } from "../../entities/Driver";
import { Employee } from "../../entities/Employee";
import { Manager } from "../../entities/Manager";
import { Permission } from "../../entities/Permission";
import { Role } from "../../entities/Role";
import { FirebaseToken } from "./FirebaseToken.entity";

@ObjectType()
@Entity()
export class Account extends Base {
  _avatar: string | null;

  @Property({ unique: true })
  @Field()
  email: string;

  @Property({ nullable: true, type: "string" })
  @Field(() => String, { nullable: true })
  get avatar(): string | null {
    if (this._avatar) return getImage(this._avatar);
    else return null;
  }

  set avatar(value: string | null) {
    this._avatar = value;
  }
  @Property()
  password: string;

  @Property({ type: "boolean" })
  @Field()
  verify: boolean;

  @Property({ type: "date" })
  @Field(() => String)
  lastActive = new Date();

  @Property({ nullable: true, type: "boolean" })
  @Field({ nullable: true })
  root: boolean;

  @OneToOne(() => Driver, (driver) => driver.account, {
    nullable: true,
    cascade: [Cascade.ALL],
  })

  // TODO: remove to employee
  @Field(() => Driver, { nullable: true })
  driver?: Driver;

  @OneToOne(() => Employee, (employee) => employee.account, {
    owner: true,
    orphanRemoval: true,
    nullable: true,
  })
  @Field(() => Employee, { nullable: true })
  employee?: Employee;

  @OneToOne(() => Manager, (manager) => manager.account, {
    nullable: true,
    cascade: [Cascade.ALL],
  })
  @Field(() => Manager, { nullable: true })
  manager: Manager;

  @ManyToMany(() => Role, (role) => role.accounts, { owner: true })
  @Field(() => [Role])
  roles = new Collection<Role>(this);

  @OneToMany(() => FirebaseToken, (token) => token.account)
  @Field(() => [FirebaseToken])
  firebaseToken = new Collection<FirebaseToken>(this);

  // @ManyToMany(() => Permission, (permission) => permission.accounts, {
  //     owner: true,
  // })
  // @Field(() => [Permission])
  // permissions = new Collection<Permission>(this);
}
