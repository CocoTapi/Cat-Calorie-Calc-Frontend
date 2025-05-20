interface User {
    user_id: string,
    user_name: string,
    pets: number[],
    food_option: string[]
}

export const USER_TEST_DATA: User[] = [
    {
        user_id: 'u0',
        user_name: 'Shiori',
        pets: [0],
        food_option: ['f0', 'f1', 'f2'],
    }
]
