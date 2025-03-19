import { CommonConstants } from "../../app.constants";

export interface Pet_Form_Data {
    id: number,
    species: 'cat' | 'dog',
    name: string,
    birthday: Date | null,

    weight: number,
    weight_unit: 'lb' | 'kg',

    allergies: string,
    medications: Pet_Form_Medication[],

    goal: 'Maintain' | 'Gain' | 'Lose',
    target_weight: number | null,

    factor: number,
    daily_calories: number | null,

    notes: string,
} 

interface Pet_Form_Medication {
    med_id: number | null,
    med_name: string,
    directions: string
}

export interface Pet_Profile extends Pet_Form_Data {   
    icon: string,
}

export type MedItemType = typeof CommonConstants.MED_NAME | typeof CommonConstants.DIRECTIONS;
