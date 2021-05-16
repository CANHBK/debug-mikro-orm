import { Migration } from '@mikro-orm/migrations';

export class Migration20210514172356 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "vehicle" add column "spec" varchar(255) null;');
    this.addSql('alter table "vehicle" drop constraint if exists "vehicle_weight_check";');
    this.addSql('alter table "vehicle" alter column "weight" type int4 using ("weight"::int4);');
    this.addSql('alter table "vehicle" alter column "weight" drop not null;');
    this.addSql('alter table "vehicle" drop constraint if exists "vehicle_description_check";');
    this.addSql('alter table "vehicle" alter column "description" type varchar(255) using ("description"::varchar(255));');
    this.addSql('alter table "vehicle" alter column "description" drop not null;');
    this.addSql('alter table "vehicle" drop constraint if exists "vehicle_maintain_time_check";');
    this.addSql('alter table "vehicle" alter column "maintain_time" type int4 using ("maintain_time"::int4);');
    this.addSql('alter table "vehicle" alter column "maintain_time" drop not null;');
    this.addSql('alter table "vehicle" drop constraint if exists "vehicle_hours_worked_check";');
    this.addSql('alter table "vehicle" alter column "hours_worked" type int4 using ("hours_worked"::int4);');
    this.addSql('alter table "vehicle" alter column "hours_worked" drop not null;');
    this.addSql('alter table "vehicle" drop constraint if exists "vehicle_guarantee_time_check";');
    this.addSql('alter table "vehicle" alter column "guarantee_time" type timestamptz(0) using ("guarantee_time"::timestamptz(0));');
    this.addSql('alter table "vehicle" alter column "guarantee_time" drop not null;');
    this.addSql('alter table "vehicle" drop constraint if exists "vehicle_odometer_check";');
    this.addSql('alter table "vehicle" alter column "odometer" type int4 using ("odometer"::int4);');
    this.addSql('alter table "vehicle" alter column "odometer" drop not null;');
    this.addSql('alter table "vehicle" drop constraint if exists "vehicle_speed_check";');
    this.addSql('alter table "vehicle" alter column "speed" type int4 using ("speed"::int4);');
    this.addSql('alter table "vehicle" alter column "speed" drop not null;');
    this.addSql('alter table "vehicle" drop constraint if exists "vehicle_license_plate_check";');
    this.addSql('alter table "vehicle" alter column "license_plate" type varchar(255) using ("license_plate"::varchar(255));');
    this.addSql('alter table "vehicle" alter column "license_plate" drop not null;');
    this.addSql('alter table "vehicle" drop constraint if exists "vehicle_run_time_check";');
    this.addSql('alter table "vehicle" alter column "run_time" type int4 using ("run_time"::int4);');
    this.addSql('alter table "vehicle" alter column "run_time" set default 0;');
    this.addSql('alter table "vehicle" drop column "name";');
    this.addSql('alter table "vehicle" drop column "information";');
  }

}
