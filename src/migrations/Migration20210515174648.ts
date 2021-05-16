import { Migration } from '@mikro-orm/migrations';

export class Migration20210515174648 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "firebase_token" ("id" serial primary key, "created_at" timestamptz(0) not null default now(), "updated_at" timestamptz(0) not null default now(), "token" varchar(255) not null, "account_id" int4 not null);');

    this.addSql('alter table "firebase_token" add constraint "firebase_token_account_id_foreign" foreign key ("account_id") references "account" ("id") on update cascade;');
  }

}
