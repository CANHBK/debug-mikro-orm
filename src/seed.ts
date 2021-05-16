import { Connection, IDatabaseDriver, MikroORM } from "@mikro-orm/core";
import { AbstractSqlConnection } from "@mikro-orm/postgresql";
import { Permission } from "./entities/Permission";
import { Role } from "./entities/Role";
import { permissions } from "./permission";

export const seed = async (orm: MikroORM<IDatabaseDriver<Connection>>) => {
  const knex = (orm.em.getConnection() as AbstractSqlConnection).getKnex();

  //   Insert permission
  await knex.raw(
    `? ON CONFLICT (code)
            DO UPDATE SET
            name = EXCLUDED.name,
            description = EXCLUDED.description,
            updated_at = now()
          RETURNING *;`,
    [
      knex("permission").insert(
        permissions.map(({ code, name, description }) => ({
          code,
          name,
          description,
        }))
      ),
    ]
  );

  //   Insert role
  await knex.raw(
    `? ON CONFLICT (name)
            DO UPDATE SET
            description = EXCLUDED.description,
            updated_at = now()
          RETURNING *;`,
    [knex("role").insert([{ name: "Root" }])]
  );

  const rootRole = await orm.em.findOne(Role, { name: "Root" });
  const storedPermissions = await orm.em.find(Permission, {});

  //   Insert all permission to root role
  await knex.raw(
    `? ON CONFLICT (role_id, permission_id)
            DO NOTHING
          RETURNING *;`,
    [
      knex("role_permissions").insert(
        storedPermissions.map(({ id }) => ({
          role_id: rootRole?.id,
          permission_id: id,
        }))
      ),
    ]
  );

  // Seed fuel
  await knex.raw(
    `? ON CONFLICT (name)
            DO NOTHING
          RETURNING *;`,
    [
      knex("fuel").insert([
        {
          name: `Xăng RON 95-IV`,
        },
        { name: `Xăng RON 95-III` },
        { name: `E5 RON 92-II` },
        { name: `DO 0,001S-V` },
        { name: `DO 0,05S-II` },
        { name: `Dầu hỏa 2-K` },
      ]),
    ]
  );

  // Seed vehicle type
  const vehicleTypes = [
    "Máy trộn bê tông",
    "Máy trộn vữa",
    "Máy vận thăng tải",
    "Máy hàn  điện 3 pha",
    "Máy phát điện",
    "Máy đầm cóc",
    "Máy đầm bàn",
    "Máy đầm dùi",
    "Máy cắt sắt",
    "Ôtô tự đổ",
    "Máy kinh vĩ",
    "Máy thuỷ bình",
    "Bơm nước chạy xăng",
    "Bơm nước chạy dầu",
    "Bơm nước chạy điện 3 pha",
    "Máy nén khí",
    "Máy phát điện chạy dầu",
    "Máy cắt đường Atsphal",
    "Kích thuỷ lực",
    "Máy xúc bánh xích",
    "Máy xúc bánh lốp",
    "Máy ủi bánh xích",
    "Máy ủi bánh lốp",
    "Xe lu rung",
    "Xe lu lốp",
    "Xe lu tĩnh",
    "Máy san gạt",
    "Máy rải thảm bê tông",
    "Cần trục bánh lốp",
    "Cần trục tháp",
    "Trạm trộn bê tông Asphall",
  ];

  await knex.raw(
    `? ON CONFLICT (name)
            DO NOTHING
          RETURNING *;`,
    [
      knex("vehicle_type").insert(
        vehicleTypes
          .filter((item) => item)
          .map((item) => ({ name: item.trim() }))
      ),
    ]
  );
  // Seed vehicle status
  const vehicleStatuses = [
    { name: "Hoạt động tốt", background: "green" },
    { name: "Hỏng", background: "red" },
  ];

  await knex.raw(
    `? ON CONFLICT (name)
            DO UPDATE
            SET background = EXCLUDED.background,
            description = EXCLUDED.description
          RETURNING *;`,
    [knex("vehicle_status").insert(vehicleStatuses.filter((item) => item))]
  );
};
