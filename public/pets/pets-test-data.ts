import { Pet_Profile } from "../../src/app/pet-profile/models/pet-profile.model";

export const PETS_TEST_DATA: Pet_Profile[] = [
    {
        id: 0,
        name: 'Dodger',
        icon: 'dodger.png',
        birthday: new Date('2014-03-14'),
        weight: 17.5,
        weight_unit: 'lb',
        allergies: "none",
        medications: [
            {
                meds_id: 0,
                meds_name: 'Atopica',
                directions: '1 pill / day'
            }
        ],
        goal: 'Reduce',
        target_weight: 16,
        factor: 0.8,
        daily_calories: 360,
        notes: 'He is shy first but once he knows people, he loves hanging out and snuggle with them.'
    }
]