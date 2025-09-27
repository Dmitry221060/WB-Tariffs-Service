jest.mock("@googleapis/sheets", () => ({
    sheets: jest.fn(() => client),
    auth: {
        GoogleAuth: jest.fn(),
    },
}));

export const updateSpreadsheetMock = jest.fn();
export const client = {
    spreadsheets: {
        values: {
            update: updateSpreadsheetMock,
        },
    },
};
