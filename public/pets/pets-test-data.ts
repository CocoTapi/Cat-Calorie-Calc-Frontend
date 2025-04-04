import { Pet_Form_Data, Pet_Profile } from "../../src/app/pet-profile/models/pet-profile.model";

export const PETS_TEST_DATA: Pet_Profile[] = [
    {
        id: 0,
        species: 'cat',
        name: 'Dodger',
        icon: 'dodger.png',
        birthday: new Date(2014, 2, 14),
        weight: 17.5,
        weight_unit: 'lb',
        allergies: "none",
        medications: [
            {
                med_id: 0,
                med_name: 'Atopica',
                directions: '1 pill / day'
            },
        ],
        goal: 'Lose',
        target_weight: 16,
        factor: 0.8,
        daily_calories: 264.8,
        notes: 'He is shy first but once he knows you, he loves hanging out and snuggle with them.'
    }
]


export const PET_TEST_FORM_DATA: Pet_Form_Data[] = [
    {
        id: 0,
        species: 'cat',
        name: 'Dodger',
        birthday: new Date(2014, 2, 14),
        weight: 17.5,
        weight_unit: 'lb',
        allergies: "none",
        medications: [
            {
                med_id: 0,
                med_name: 'Atopica',
                directions: '1 pill / day'
            },
        ],
        goal: 'Lose',
        target_weight: 16,
        factor: 0.8,
        daily_calories: 264.8,
        notes: 'He is shy first but once he knows you, he loves hanging out and snuggle with them.'
    }
]

