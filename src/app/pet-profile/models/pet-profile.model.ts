import { CommonConstants } from "../../app.constants";

export interface Pet_Form_Data {
    id: number,
    species: 'cat' | 'dog',
    name: string,
    birthday: Date,

    weight: number,
    weight_unit: 'lb' | 'kg',

    allergies: string,
    medications: Pet_Form_Medication[],

    goal: 'Maintain' | 'Gain' | 'Lose',
    target_weight: number,

    factor: number,
    daily_calories: number,

    notes: string,
} 

interface Pet_Form_Medication {
    med_id: number | null,
    med_name: string,
    directions: string
}

export interface Suggested_Factor {
    Maintain : number,
    Lose: number,
    Gain: number
}

export type GoalKeys = keyof Suggested_Factor;  // 'Maintain' | 'Lose' | 'Gain'


export interface Pet_Profile extends Pet_Form_Data {   
    icon: string,
}

export type MedItemType = 
    typeof CommonConstants.MED_NAME | 
    typeof CommonConstants.DIRECTIONS;

export type UnitType = 
    typeof CommonConstants.LB | 
    typeof CommonConstants.KG;

export type GoalType = 
    typeof CommonConstants.MAINTAIN | 
    typeof CommonConstants.GAIN | 
    typeof CommonConstants.LOSE;


