/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function seed(knex) {
    await knex("spreadsheets")
        .insert([{ spreadsheet_id: "1N0fxfJirp5zJJaWGpS0y4iMarrEuc80GtsK2VrW2IdA" }])
        .onConflict(["spreadsheet_id"])
        .ignore();
}
