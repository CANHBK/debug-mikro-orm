import { Migration } from "@mikro-orm/migrations";

export class Migration20210513093929 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "vehicle_type" ("id" serial primary key, "created_at" timestamptz(0) not null default now(), "updated_at" timestamptz(0) not null default now(), "name" varchar(255) not null);'
    );

    this.addSql(
      'create table "vehicle_status" ("id" serial primary key, "created_at" timestamptz(0) not null default now(), "updated_at" timestamptz(0) not null default now(), "name" varchar(255) not null, "description" varchar(255) null, "background" varchar(255) null);'
    );
    this.addSql(
      'alter table "vehicle_status" add constraint "vehicle_status_name_unique" unique ("name");'
    );

    this.addSql(
      'create table "vehicle_fuel" ("id" serial primary key, "created_at" timestamptz(0) not null default now(), "updated_at" timestamptz(0) not null default now(), "name" varchar(255) not null);'
    );

    this.addSql(
      'create table "user" ("id" serial primary key, "created_at" timestamptz(0) not null default now(), "updated_at" timestamptz(0) not null default now(), "email" varchar(255) not null, "password" varchar(255) not null);'
    );
    this.addSql(
      'alter table "user" add constraint "user_email_unique" unique ("email");'
    );

    this.addSql(
      'create table "role" ("id" serial primary key, "created_at" timestamptz(0) not null default now(), "updated_at" timestamptz(0) not null default now(), "name" varchar(255) not null, "description" varchar(255) null, "is_nominal" bool not null default false);'
    );
    this.addSql(
      'alter table "role" add constraint "role_name_unique" unique ("name");'
    );

    this.addSql(
      'create table "project" ("id" serial primary key, "created_at" timestamptz(0) not null default now(), "updated_at" timestamptz(0) not null default now(), "name" varchar(255) not null, "description" varchar(255) null, "start" timestamptz(0) not null, "end" timestamptz(0) null, "value" varchar(255) null, "place" jsonb null, "company_role" varchar(255) null, "progress" int4 not null);'
    );
    this.addSql(
      'alter table "project" add constraint "project_name_unique" unique ("name");'
    );

    this.addSql(
      'create table "post" ("id" serial primary key, "created_at" timestamptz(0) not null default now(), "updated_at" timestamptz(0) not null default now(), "title" text not null);'
    );

    this.addSql(
      'create table "permission" ("id" serial primary key, "created_at" timestamptz(0) not null default now(), "updated_at" timestamptz(0) not null default now(), "name" varchar(255) not null, "code" varchar(255) not null, "description" varchar(255) null);'
    );
    this.addSql(
      'alter table "permission" add constraint "permission_code_unique" unique ("code");'
    );

    this.addSql(
      'create table "role_permissions" ("role_id" int4 not null, "permission_id" int4 not null);'
    );
    this.addSql(
      'alter table "role_permissions" add constraint "role_permissions_pkey" primary key ("role_id", "permission_id");'
    );

    this.addSql(
      'create table "notification_method" ("id" serial primary key, "created_at" timestamptz(0) not null default now(), "updated_at" timestamptz(0) not null default now(), "name" varchar(255) not null);'
    );

    this.addSql(
      'create table "notification_group" ("id" serial primary key, "created_at" timestamptz(0) not null default now(), "updated_at" timestamptz(0) not null default now(), "name" varchar(255) not null, "description" varchar(255) null);'
    );

    this.addSql(
      'create table "notification" ("id" serial primary key, "created_at" timestamptz(0) not null default now(), "updated_at" timestamptz(0) not null default now(), "name" varchar(255) not null, "description" varchar(255) null, "group_id" int4 null);'
    );

    this.addSql(
      'create table "manufacturer" ("id" serial primary key, "created_at" timestamptz(0) not null default now(), "updated_at" timestamptz(0) not null default now(), "name" varchar(255) not null);'
    );
    this.addSql(
      'alter table "manufacturer" add constraint "manufacturer_name_unique" unique ("name");'
    );

    this.addSql(
      'create table "vehicle_model" ("id" serial primary key, "created_at" timestamptz(0) not null default now(), "updated_at" timestamptz(0) not null default now(), "manufacturer_id" int4 not null, "name" varchar(255) not null);'
    );

    this.addSql(
      'create table "vehicle" ("id" serial primary key, "created_at" timestamptz(0) not null default now(), "updated_at" timestamptz(0) not null default now(), "name" varchar(255) not null, "weight" int4 not null, "information" varchar(255) not null, "description" varchar(255) not null, "maintain_time" int4 not null, "hours_worked" int4 not null, "guarantee_time" timestamptz(0) not null, "odometer" int4 not null, "speed" int4 not null, "vin" varchar(255) not null, "license_plate" varchar(255) not null, "year" varchar(255) not null, "run_time" int4 not null, "manufacturer_id" int4 not null, "model_id" int4 not null, "status_id" int4 not null, "fuel_id" int4 not null, "type_id" int4 not null);'
    );

    this.addSql(
      'create table "maintain_task" ("id" serial primary key, "created_at" timestamptz(0) not null default now(), "updated_at" timestamptz(0) not null default now(), "name" varchar(255) not null, "description" varchar(255) not null);'
    );

    this.addSql(
      'create table "maintain_program" ("id" serial primary key, "created_at" timestamptz(0) not null default now(), "updated_at" timestamptz(0) not null default now(), "name" varchar(255) not null, "description" varchar(255) not null);'
    );

    this.addSql(
      'create table "maintain_program_task" ("id" serial primary key, "created_at" timestamptz(0) not null default now(), "updated_at" timestamptz(0) not null default now(), "time_threshold" int4 null, "distance_threshold" int4 null, "done" bool not null, "maintain_program_id" int4 null, "maintain_task_id" int4 null);'
    );

    this.addSql(
      'create table "vehicle_maintain_programs" ("vehicle_id" int4 not null, "maintain_program_id" int4 not null);'
    );
    this.addSql(
      'alter table "vehicle_maintain_programs" add constraint "vehicle_maintain_programs_pkey" primary key ("vehicle_id", "maintain_program_id");'
    );

    this.addSql(
      'create table "label" ("id" serial primary key, "created_at" timestamptz(0) not null default now(), "updated_at" timestamptz(0) not null default now(), "name" varchar(255) not null);'
    );

    this.addSql(
      'create table "issue" ("id" serial primary key, "created_at" timestamptz(0) not null default now(), "updated_at" timestamptz(0) not null default now(), "description" varchar(255) not null, "vehicle_id" int4 not null);'
    );

    this.addSql(
      'create table "issue_labels" ("issue_id" int4 not null, "label_id" int4 not null);'
    );
    this.addSql(
      'alter table "issue_labels" add constraint "issue_labels_pkey" primary key ("issue_id", "label_id");'
    );

    this.addSql(
      'create table "inspection_item" ("id" serial primary key, "created_at" timestamptz(0) not null default now(), "updated_at" timestamptz(0) not null default now(), "name" varchar(255) not null, "type" text check ("type" in (\'choices\', \'passOrFail\', \'dateTime\', \'rangeTime\')) not null);'
    );

    this.addSql(
      'create table "inspection_form" ("id" serial primary key, "created_at" timestamptz(0) not null default now(), "updated_at" timestamptz(0) not null default now(), "name" varchar(255) not null, "created_by" int4 not null);'
    );
    this.addSql(
      'alter table "inspection_form" add constraint "inspection_form_name_unique" unique ("name");'
    );

    this.addSql(
      'create table "inspection_form_item" ("id" serial primary key, "created_at" timestamptz(0) not null default now(), "updated_at" timestamptz(0) not null default now(), "required" bool not null, "short_description" varchar(255) not null, "instruction" varchar(255) not null, "remark_for_pass" bool not null, "remark_for_fail" bool not null, "is_pass" bool null, "choices" jsonb null, "date" timestamptz(0) null, "range_start" int4 null, "range_end" int4 null, "inspection_form_id" int4 not null, "inspection_item_id" int4 not null);'
    );

    this.addSql(
      'create table "expense" ("id" serial primary key, "created_at" timestamptz(0) not null default now(), "updated_at" timestamptz(0) not null default now(), "name" varchar(255) not null);'
    );

    this.addSql(
      'create table "vehicle_expenses" ("vehicle_id" int4 not null, "expense_id" int4 not null);'
    );
    this.addSql(
      'alter table "vehicle_expenses" add constraint "vehicle_expenses_pkey" primary key ("vehicle_id", "expense_id");'
    );

    this.addSql(
      'create table "employee" ("id" serial primary key, "created_at" timestamptz(0) not null default now(), "updated_at" timestamptz(0) not null default now(), "name" varchar(255) not null, "email" varchar(255) not null, "phone" varchar(255) null, "address" jsonb null, "date_of_birth" varchar(255) null, "salary" int4 null, "unit" varchar(255) null, "start_work" timestamptz(0) null, "end_work" timestamptz(0) null);'
    );

    this.addSql(
      'create table "issue_assignees" ("issue_id" int4 not null, "employee_id" int4 not null);'
    );
    this.addSql(
      'alter table "issue_assignees" add constraint "issue_assignees_pkey" primary key ("issue_id", "employee_id");'
    );

    this.addSql(
      'create table "device" ("id" serial primary key, "created_at" timestamptz(0) not null default now(), "updated_at" timestamptz(0) not null default now(), "udi" varchar(255) not null, "name" varchar(255) null, "state" text check ("state" in (\'init\', \'ready\', \'disconnected\', \'sleeping\', \'lost\', \'alert\')) null, "description" varchar(255) null, "settings" jsonb null, "homie" varchar(255) null, "implementation" varchar(255) null, "gps_signal" bool null, "sim_signal_strength" float null, "sim_manufacturer" varchar(255) null, "sim_model" varchar(255) null, "sim_imei" varchar(255) null, "sim_state" text check ("sim_state" in (\'init\', \'ready\', \'disconnected\', \'sleeping\', \'lost\', \'alert\')) null, "vehicle_id" int4 null);'
    );
    this.addSql(
      'alter table "device" add constraint "device_udi_unique" unique ("udi");'
    );
    this.addSql(
      'alter table "device" add constraint "device_vehicle_id_unique" unique ("vehicle_id");'
    );

    this.addSql(
      'create table "device_temperature" ("id" serial primary key, "created_at" timestamptz(0) not null default now(), "updated_at" timestamptz(0) not null default now(), "device_id" int4 null, "temperature" int4 not null, "by_id" int4 not null);'
    );

    this.addSql(
      'create table "environment" ("id" serial primary key, "created_at" timestamptz(0) not null default now(), "updated_at" timestamptz(0) not null default now(), "device_id" int4 not null, "humidity" int4 not null, "temperature" int4 not null, "by_id" int4 not null);'
    );

    this.addSql(
      'create table "location" ("id" serial primary key, "created_at" timestamptz(0) not null default now(), "updated_at" timestamptz(0) not null default now(), "vehicle_id" int4 null, "lat" int4 not null, "long" int4 not null, "time" varchar(255) not null, "by_id" int4 not null);'
    );

    this.addSql(
      'create table "speed" ("id" serial primary key, "created_at" timestamptz(0) not null default now(), "updated_at" timestamptz(0) not null default now(), "vehicle_id" int4 not null, "speed" int4 not null, "by_id" int4 not null);'
    );

    this.addSql(
      'create table "battery_voltage" ("id" serial primary key, "created_at" timestamptz(0) not null default now(), "updated_at" timestamptz(0) not null default now(), "vehicle_id" int4 not null, "voltage" int4 not null, "by_id" int4 not null);'
    );

    this.addSql(
      'create table "account" ("id" serial primary key, "created_at" timestamptz(0) not null default now(), "updated_at" timestamptz(0) not null default now(), "email" varchar(255) not null, "avatar" varchar(255) null, "password" varchar(255) not null, "verify" bool not null, "last_active" timestamptz(0) not null, "root" bool null, "employee_id" int4 null);'
    );
    this.addSql(
      'alter table "account" add constraint "account_email_unique" unique ("email");'
    );
    this.addSql(
      'alter table "account" add constraint "account_employee_id_unique" unique ("employee_id");'
    );

    this.addSql(
      'create table "account_notification_group" ("id" serial primary key, "created_at" timestamptz(0) not null default now(), "updated_at" timestamptz(0) not null default now(), "enable" bool not null, "account_id" int4 not null, "notification_group_id" int4 not null);'
    );

    this.addSql(
      'create table "account_notification_method" ("id" serial primary key, "created_at" timestamptz(0) not null default now(), "updated_at" timestamptz(0) not null default now(), "enable" bool not null, "account_id" int4 not null, "notification_method_id" int4 not null, "notification_id" int4 not null);'
    );

    this.addSql(
      'create table "driver" ("employee_id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "license_number" varchar(255) null, "license_class" varchar(255) null, "license_where" varchar(255) null, "account_id" int4 null);'
    );
    this.addSql(
      'alter table "driver" add constraint "driver_employee_id_unique" unique ("employee_id");'
    );
    this.addSql(
      'alter table "driver" add constraint "driver_account_id_unique" unique ("account_id");'
    );

    this.addSql(
      'create table "maintain_history" ("id" serial primary key, "created_at" timestamptz(0) not null default now(), "updated_at" timestamptz(0) not null default now(), "driver_employee_id" int4 not null, "vehicle_id" int4 not null, "type" text check ("type" in (\'maintaince\', \'repair\')) not null, "time" timestamptz(0) not null);'
    );

    this.addSql(
      'create table "refill_history" ("id" serial primary key, "created_at" timestamptz(0) not null default now(), "updated_at" timestamptz(0) not null default now(), "driver_employee_id" int4 not null, "vehicle_id" int4 not null, "type" text check ("type" in (\'gasoline\', \'oil\')) not null, "time" timestamptz(0) not null, "price" varchar(255) not null, "current_price" varchar(255) not null);'
    );

    this.addSql(
      'create table "report" ("id" serial primary key, "created_at" timestamptz(0) not null default now(), "updated_at" timestamptz(0) not null default now(), "driver_employee_id" int4 not null);'
    );

    this.addSql(
      'create table "manager" ("employee_id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null,  "account_id" int4 null);'
    );
    this.addSql(
      'alter table "manager" add constraint "manager_employee_id_unique" unique ("employee_id");'
    );
    this.addSql(
      'alter table "manager" add constraint "manager_account_id_unique" unique ("account_id");'
    );

    this.addSql(
      'create table "decision" ("id" serial primary key, "created_at" timestamptz(0) not null default now(), "updated_at" timestamptz(0) not null default now(), "manager_employee_id" int4 not null);'
    );

    this.addSql(
      'create table "manager_project" ("id" serial primary key, "created_at" timestamptz(0) not null default now(), "updated_at" timestamptz(0) not null default now(), "manager_employee_id" int4 not null, "project_id" int4 not null);'
    );

    this.addSql(
      'create table "mobilization_session" ("id" serial primary key, "created_at" timestamptz(0) not null default now(), "updated_at" timestamptz(0) not null default now(), "start" timestamptz(0) not null, "start_odometer" int4 not null, "end" timestamptz(0) null, "end_odometer" int4 null, "pending" bool not null, "driver_employee_id" int4 not null, "manager_employee_id" int4 not null, "vehicle_id" int4 not null, "decision_id" int4 not null, "project_id" int4 null, "description" varchar(255) not null);'
    );

    this.addSql(
      'create table "project_driver" ("id" serial primary key, "created_at" timestamptz(0) not null default now(), "updated_at" timestamptz(0) not null default now(), "driver_employee_id" int4 not null, "project_id" int4 not null, "manager_employee_id" int4 not null);'
    );

    this.addSql(
      'create table "project_vehicle_assignment" ("id" serial primary key, "created_at" timestamptz(0) not null default now(), "updated_at" timestamptz(0) not null default now(), "notes" text null, "driver_employee_id" int4 not null, "project_id" int4 null, "created_by_employee_id" int4 not null, "updated_by_employee_id" int4 not null);'
    );

    this.addSql(
      'create table "account_roles" ("account_id" int4 not null, "role_id" int4 not null);'
    );
    this.addSql(
      'alter table "account_roles" add constraint "account_roles_pkey" primary key ("account_id", "role_id");'
    );

    this.addSql(
      'alter table "role_permissions" add constraint "role_permissions_role_id_foreign" foreign key ("role_id") references "role" ("id") on update cascade on delete cascade;'
    );
    this.addSql(
      'alter table "role_permissions" add constraint "role_permissions_permission_id_foreign" foreign key ("permission_id") references "permission" ("id") on update cascade on delete cascade;'
    );

    this.addSql(
      'alter table "notification" add constraint "notification_group_id_foreign" foreign key ("group_id") references "notification_group" ("id") on update cascade on delete set null;'
    );

    this.addSql(
      'alter table "vehicle_model" add constraint "vehicle_model_manufacturer_id_foreign" foreign key ("manufacturer_id") references "manufacturer" ("id") on update cascade;'
    );

    this.addSql(
      'alter table "vehicle" add constraint "vehicle_manufacturer_id_foreign" foreign key ("manufacturer_id") references "manufacturer" ("id") on update cascade;'
    );
    this.addSql(
      'alter table "vehicle" add constraint "vehicle_model_id_foreign" foreign key ("model_id") references "vehicle_model" ("id") on update cascade;'
    );
    this.addSql(
      'alter table "vehicle" add constraint "vehicle_status_id_foreign" foreign key ("status_id") references "vehicle_status" ("id") on update cascade;'
    );
    this.addSql(
      'alter table "vehicle" add constraint "vehicle_fuel_id_foreign" foreign key ("fuel_id") references "vehicle_fuel" ("id") on update cascade;'
    );
    this.addSql(
      'alter table "vehicle" add constraint "vehicle_type_id_foreign" foreign key ("type_id") references "vehicle_type" ("id") on update cascade;'
    );

    this.addSql(
      'alter table "maintain_program_task" add constraint "maintain_program_task_maintain_program_id_foreign" foreign key ("maintain_program_id") references "maintain_program" ("id") on update cascade on delete set null;'
    );
    this.addSql(
      'alter table "maintain_program_task" add constraint "maintain_program_task_maintain_task_id_foreign" foreign key ("maintain_task_id") references "maintain_task" ("id") on update cascade on delete set null;'
    );

    this.addSql(
      'alter table "vehicle_maintain_programs" add constraint "vehicle_maintain_programs_vehicle_id_foreign" foreign key ("vehicle_id") references "vehicle" ("id") on update cascade on delete cascade;'
    );
    this.addSql(
      'alter table "vehicle_maintain_programs" add constraint "vehicle_maintain_programs_maintain_program_id_foreign" foreign key ("maintain_program_id") references "maintain_program" ("id") on update cascade on delete cascade;'
    );

    this.addSql(
      'alter table "issue" add constraint "issue_vehicle_id_foreign" foreign key ("vehicle_id") references "vehicle" ("id") on update cascade;'
    );

    this.addSql(
      'alter table "issue_labels" add constraint "issue_labels_issue_id_foreign" foreign key ("issue_id") references "issue" ("id") on update cascade on delete cascade;'
    );
    this.addSql(
      'alter table "issue_labels" add constraint "issue_labels_label_id_foreign" foreign key ("label_id") references "label" ("id") on update cascade on delete cascade;'
    );

    this.addSql(
      'alter table "inspection_form_item" add constraint "inspection_form_item_inspection_form_id_foreign" foreign key ("inspection_form_id") references "inspection_form" ("id") on update cascade;'
    );
    this.addSql(
      'alter table "inspection_form_item" add constraint "inspection_form_item_inspection_item_id_foreign" foreign key ("inspection_item_id") references "inspection_item" ("id") on update cascade;'
    );

    this.addSql(
      'alter table "vehicle_expenses" add constraint "vehicle_expenses_vehicle_id_foreign" foreign key ("vehicle_id") references "vehicle" ("id") on update cascade on delete cascade;'
    );
    this.addSql(
      'alter table "vehicle_expenses" add constraint "vehicle_expenses_expense_id_foreign" foreign key ("expense_id") references "expense" ("id") on update cascade on delete cascade;'
    );

    this.addSql(
      'alter table "issue_assignees" add constraint "issue_assignees_issue_id_foreign" foreign key ("issue_id") references "issue" ("id") on update cascade on delete cascade;'
    );
    this.addSql(
      'alter table "issue_assignees" add constraint "issue_assignees_employee_id_foreign" foreign key ("employee_id") references "employee" ("id") on update cascade on delete cascade;'
    );

    this.addSql(
      'alter table "device" add constraint "device_vehicle_id_foreign" foreign key ("vehicle_id") references "vehicle" ("id") on update cascade on delete set null;'
    );

    this.addSql(
      'alter table "device_temperature" add constraint "device_temperature_device_id_foreign" foreign key ("device_id") references "device" ("id") on update cascade on delete set null;'
    );
    this.addSql(
      'alter table "device_temperature" add constraint "device_temperature_by_id_foreign" foreign key ("by_id") references "device" ("id") on update cascade;'
    );

    this.addSql(
      'alter table "environment" add constraint "environment_device_id_foreign" foreign key ("device_id") references "device" ("id") on update cascade;'
    );
    this.addSql(
      'alter table "environment" add constraint "environment_by_id_foreign" foreign key ("by_id") references "device" ("id") on update cascade;'
    );

    this.addSql(
      'alter table "location" add constraint "location_vehicle_id_foreign" foreign key ("vehicle_id") references "vehicle" ("id") on update cascade on delete set null;'
    );
    this.addSql(
      'alter table "location" add constraint "location_by_id_foreign" foreign key ("by_id") references "device" ("id") on update cascade;'
    );

    this.addSql(
      'alter table "speed" add constraint "speed_vehicle_id_foreign" foreign key ("vehicle_id") references "vehicle" ("id") on update cascade;'
    );
    this.addSql(
      'alter table "speed" add constraint "speed_by_id_foreign" foreign key ("by_id") references "device" ("id") on update cascade;'
    );

    this.addSql(
      'alter table "battery_voltage" add constraint "battery_voltage_vehicle_id_foreign" foreign key ("vehicle_id") references "vehicle" ("id") on update cascade;'
    );
    this.addSql(
      'alter table "battery_voltage" add constraint "battery_voltage_by_id_foreign" foreign key ("by_id") references "device" ("id") on update cascade;'
    );

    this.addSql(
      'alter table "account" add constraint "account_employee_id_foreign" foreign key ("employee_id") references "employee" ("id") on update cascade on delete set null;'
    );

    this.addSql(
      'alter table "account_notification_group" add constraint "account_notification_group_account_id_foreign" foreign key ("account_id") references "account" ("id") on update cascade;'
    );
    this.addSql(
      'alter table "account_notification_group" add constraint "account_notification_group_notification_group_id_foreign" foreign key ("notification_group_id") references "notification_group" ("id") on update cascade;'
    );

    this.addSql(
      'alter table "account_notification_method" add constraint "account_notification_method_account_id_foreign" foreign key ("account_id") references "account" ("id") on update cascade;'
    );
    this.addSql(
      'alter table "account_notification_method" add constraint "account_notification_method_notification_method_id_foreign" foreign key ("notification_method_id") references "notification_method" ("id") on update cascade;'
    );
    this.addSql(
      'alter table "account_notification_method" add constraint "account_notification_method_notification_id_foreign" foreign key ("notification_id") references "notification" ("id") on update cascade;'
    );

    this.addSql(
      'alter table "driver" add constraint "driver_employee_id_foreign" foreign key ("employee_id") references "employee" ("id") on update cascade;'
    );
    this.addSql(
      'alter table "driver" add constraint "driver_account_id_foreign" foreign key ("account_id") references "account" ("id") on update cascade on delete cascade;'
    );

    this.addSql(
      'alter table "maintain_history" add constraint "maintain_history_driver_employee_id_foreign" foreign key ("driver_employee_id") references "driver" ("employee_id") on update cascade;'
    );
    this.addSql(
      'alter table "maintain_history" add constraint "maintain_history_vehicle_id_foreign" foreign key ("vehicle_id") references "vehicle" ("id") on update cascade;'
    );

    this.addSql(
      'alter table "refill_history" add constraint "refill_history_driver_employee_id_foreign" foreign key ("driver_employee_id") references "driver" ("employee_id") on update cascade;'
    );
    this.addSql(
      'alter table "refill_history" add constraint "refill_history_vehicle_id_foreign" foreign key ("vehicle_id") references "vehicle" ("id") on update cascade;'
    );

    this.addSql(
      'alter table "report" add constraint "report_driver_employee_id_foreign" foreign key ("driver_employee_id") references "driver" ("employee_id") on update cascade;'
    );

    this.addSql(
      'alter table "manager" add constraint "manager_employee_id_foreign" foreign key ("employee_id") references "employee" ("id") on update cascade;'
    );
    this.addSql(
      'alter table "manager" add constraint "manager_account_id_foreign" foreign key ("account_id") references "account" ("id") on update cascade on delete cascade;'
    );

    this.addSql(
      'alter table "decision" add constraint "decision_manager_employee_id_foreign" foreign key ("manager_employee_id") references "manager" ("employee_id") on update cascade;'
    );

    this.addSql(
      'alter table "manager_project" add constraint "manager_project_manager_employee_id_foreign" foreign key ("manager_employee_id") references "manager" ("employee_id") on update cascade;'
    );
    this.addSql(
      'alter table "manager_project" add constraint "manager_project_project_id_foreign" foreign key ("project_id") references "project" ("id") on update cascade;'
    );

    this.addSql(
      'alter table "mobilization_session" add constraint "mobilization_session_driver_employee_id_foreign" foreign key ("driver_employee_id") references "driver" ("employee_id") on update cascade;'
    );
    this.addSql(
      'alter table "mobilization_session" add constraint "mobilization_session_manager_employee_id_foreign" foreign key ("manager_employee_id") references "manager" ("employee_id") on update cascade;'
    );
    this.addSql(
      'alter table "mobilization_session" add constraint "mobilization_session_vehicle_id_foreign" foreign key ("vehicle_id") references "vehicle" ("id") on update cascade;'
    );
    this.addSql(
      'alter table "mobilization_session" add constraint "mobilization_session_decision_id_foreign" foreign key ("decision_id") references "decision" ("id") on update cascade;'
    );
    this.addSql(
      'alter table "mobilization_session" add constraint "mobilization_session_project_id_foreign" foreign key ("project_id") references "project" ("id") on update cascade on delete set null;'
    );

    this.addSql(
      'alter table "project_driver" add constraint "project_driver_driver_employee_id_foreign" foreign key ("driver_employee_id") references "driver" ("employee_id") on update cascade;'
    );
    this.addSql(
      'alter table "project_driver" add constraint "project_driver_project_id_foreign" foreign key ("project_id") references "project" ("id") on update cascade;'
    );
    this.addSql(
      'alter table "project_driver" add constraint "project_driver_manager_employee_id_foreign" foreign key ("manager_employee_id") references "manager" ("employee_id") on update cascade;'
    );

    this.addSql(
      'alter table "project_vehicle_assignment" add constraint "project_vehicle_assignment_driver_employee_id_foreign" foreign key ("driver_employee_id") references "driver" ("employee_id") on update cascade;'
    );
    this.addSql(
      'alter table "project_vehicle_assignment" add constraint "project_vehicle_assignment_project_id_foreign" foreign key ("project_id") references "project" ("id") on update cascade on delete set null;'
    );
    this.addSql(
      'alter table "project_vehicle_assignment" add constraint "project_vehicle_assignment_created_by_employee_id_foreign" foreign key ("created_by_employee_id") references "manager" ("employee_id") on update cascade;'
    );
    this.addSql(
      'alter table "project_vehicle_assignment" add constraint "project_vehicle_assignment_updated_by_employee_id_foreign" foreign key ("updated_by_employee_id") references "manager" ("employee_id") on update cascade;'
    );

    this.addSql(
      'alter table "account_roles" add constraint "account_roles_account_id_foreign" foreign key ("account_id") references "account" ("id") on update cascade on delete cascade;'
    );
    this.addSql(
      'alter table "account_roles" add constraint "account_roles_role_id_foreign" foreign key ("role_id") references "role" ("id") on update cascade on delete cascade;'
    );

    this.addSql(
      'alter table "vehicle_type" add constraint "vehicle_type_name_unique" unique ("name");'
    );

    this.addSql(
      'alter table "vehicle_fuel" add constraint "vehicle_fuel_name_unique" unique ("name");'
    );

    this.addSql(
      'alter table "vehicle_model" add constraint "vehicle_model_manufacturer_id_name_unique" unique ("manufacturer_id", "name");'
    );

    this.addSql(
      'alter table "expense" add constraint "expense_name_unique" unique ("name");'
    );
  }
}
