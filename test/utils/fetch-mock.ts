export const fetchSpy = jest.spyOn(global, "fetch").mockImplementation(
    jest.fn(() =>
        Promise.resolve({
            status: 200,
            json: async () => fetchJsonResponseMock(),
        }),
    ) as jest.Mock,
);

export const fetchJsonResponseMock = jest.fn(() => ({ response: {} }));
