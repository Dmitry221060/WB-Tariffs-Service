jest.mock("knex", () => jest.fn(() => knexMock));

export const querybuilder = {
    where: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    onConflict: jest.fn().mockReturnThis(),
    merge: jest.fn().mockReturnThis(),
    orderByRaw: jest.fn().mockReturnThis(),
};

export const knexMock = jest.fn().mockReturnValue(querybuilder);
