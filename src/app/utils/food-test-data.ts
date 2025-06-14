export type FoodType = 'dryFood' | 'wetFood' | 'treat';
export type FamiliarUnitType =  'usCup'| 'cup' | 'tbsp' | 'tsp' | 'packet' | 'piece' | 'can' | 'treat';

interface Food {
    id: string,
    user_id: string,
    food_name: string,
    food_type: FoodType,
    net_wt: number,
    net_unit: 'lb' | 'kg' | 'oz' | 'g',
    expiration_date: Date,
    base_caloric_content: number,
    familiar_caloric_content: number,
    familiar_unit: FamiliarUnitType,
}

export const FOOD_TEST_DATA: Food[] = [
    {
        id: 'f0',
        user_id: 'u0',
        food_name: 'Purina One',
        food_type: 'dryFood',
        net_wt: 51.2,
        net_unit: 'oz',
        expiration_date: new Date(2025, 10, 1),
        base_caloric_content: 3648,
        familiar_caloric_content: 356,
        familiar_unit: 'usCup', 
    },
    {
        id: 'f1',
        user_id: 'u0',
        food_name: 'Churu',
        food_type: 'treat',
        net_wt: 10,
        net_unit: 'oz',
        expiration_date: new Date(2025, 11, 1),
        base_caloric_content: 430,
        familiar_caloric_content: 6,
        familiar_unit: 'packet', 
    },
    {
        id: 'f2',
        user_id: 'u0',
        food_name: 'Greenies Dental Treats',
        food_type: 'treat',
        net_wt: 9.75,
        net_unit: 'oz',
        expiration_date: new Date(2025, 9, 1),
        base_caloric_content: 3576,
        familiar_caloric_content: 1.4,
        familiar_unit: 'treat', 
    },
     {
        id: 'f3',
        user_id: 'u0',
        food_name: 'Grilled Tuna',
        food_type: 'wetFood',
        net_wt: 85*8,
        net_unit: 'g',
        expiration_date: new Date(2025, 9, 1),
        base_caloric_content: 823,
        familiar_caloric_content: 70,
        familiar_unit: 'can', 
    },

]