import { Migration } from '@mikro-orm/migrations';

export class Migration20210515091527 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "device_temperature" drop constraint if exists "device_temperature_device_id_check";');
    this.addSql('alter table "device_temperature" alter column "device_id" type int4 using ("device_id"::int4);');
    this.addSql('alter table "device_temperature" alter column "device_id" set not null;');
    this.addSql('alter table "device_temperature" drop constraint "device_temperature_by_id_foreign";');
    this.addSql('alter table "device_temperature" drop column "by_id";');
  }

}
