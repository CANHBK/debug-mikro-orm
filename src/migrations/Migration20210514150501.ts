import { Migration } from "@mikro-orm/migrations";

export class Migration20210514150501 extends Migration {
  async up(): Promise<void> {
    this.addSql('alter table "vehicle_fuel" rename to "fuel";');
  }
}
