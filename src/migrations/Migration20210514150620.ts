import { Migration } from '@mikro-orm/migrations';

export class Migration20210514150620 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "fuel" drop constraint "vehicle_fuel_name_unique";');

    this.addSql('alter table "fuel" add constraint "fuel_name_unique" unique ("name");');
  }

}
