export const expirationQueue = {
    add: jest.fn().mockImplementation(
        (data: { orderId: string }, { delay: number }) => { }
    )
}