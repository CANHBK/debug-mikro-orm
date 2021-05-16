import {
  Collection,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  Property,
} from "@mikro-orm/core";
import { Field, ObjectType, InputType } from "type-graphql";
import { Base } from "../../entities/Base";
import { Expense } from "../../entities/Expense";
import { MaintainProgram } from "../../entities/MaintainProgram";
import { Manufacturer } from "../../entities/Manufacturer";
import { MobilizationSession } from "../../entities/MobilizationSession";
import { Fuel } from "../fuels/Fuel.entity";
import { VehicleModel } from "../../entities/VehicleModel";
import { VehicleStatus } from "./VehicleStatus.entity";
import { VehicleType } from "./VehicleType.entity";

@ObjectType()
@Entity()
export class Vehicle extends Base {
  @Field({
    description: "Tên phương tiện",
  })
  name!: string;

  @Field({ nullable: true, description: "Tải trọng" })
  @Property({ nullable: true })
  weight!: number;

  @Field({ nullable: true, description: "Thông số kỹ thuật" })
  @Property({ nullable: true })
  spec: string;

  @Field({ nullable: true, description: "Giới thiệu, mô tả phương tiện" })
  @Property({ nullable: true })
  description: string;

  @Field({
    nullable: true,
    description: "Số ngày làm việc giữa 2 lần bảo dưỡng",
  })
  @Property({ nullable: true })
  maintainTime: number;

  @Field({
    nullable: true,
    description: "Số giờ hoạt động sau lần bảo dưỡng gần nhất",
  })
  @Property({ nullable: true })
  hoursWorked: number;

  @Field({
    nullable: true,
    description: "Mốc thời gian kết thúc bảo hành",
  })
  @Property({ nullable: true })
  guaranteeTime: Date;

  @Field({
    nullable: true,
    description: "Số công tơ mét",
  })
  @Property({ nullable: true })
  odometer: number;

  @Property({ nullable: true })
  @Field({ nullable: true })
  speed: number;

  @Property()
  @Field({
    description: "Số khung xe",
  })
  vin: string;

  @Property({ nullable: true })
  @Field({ nullable: true, description: "Biển số xe" })
  licensePlate: string;

  @Property()
  @Field({
    description: "Năm sản xuất",
  })
  year: string;

  @Property({ default: 0 })
  @Field()
  runTime: number;

  @Field(() => Manufacturer)
  @ManyToOne(() => Manufacturer)
  manufacturer!: Manufacturer;

  @Field(() => VehicleModel)
  @ManyToOne(() => VehicleModel)
  model!: VehicleModel;

  @Field(() => VehicleStatus)
  @ManyToOne(() => VehicleStatus)
  status!: VehicleStatus;

  @Field(() => Fuel)
  @ManyToOne(() => Fuel)
  fuel!: Fuel;

  @Field(() => VehicleType)
  @ManyToOne(() => VehicleType)
  type!: VehicleType;

  @ManyToMany(() => Expense, (expense) => expense.vehicles, { owner: true })
  @Field(() => [Expense])
  expenses = new Collection<Expense>(this);

  @OneToMany(
    () => MobilizationSession,
    (mobilizationSession) => mobilizationSession.vehicle
  )
  @Field(() => [MobilizationSession])
  mobilizationSessions = new Collection<MobilizationSession>(this);

  @ManyToMany(
    () => MaintainProgram,
    (maintainProgram) => maintainProgram.vehicles,
    { owner: true }
  )
  @Field(() => [MaintainProgram])
  maintainPrograms = new Collection<MaintainProgram>(this);
}
