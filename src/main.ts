import { migrate, seed } from "#postgres/knex";
import server from "#app/server.js";

void (async () => {
    await migrate.latest();
    await seed.run();
    console.log("All migrations and seeds have been run");

    await server.start();
})();
