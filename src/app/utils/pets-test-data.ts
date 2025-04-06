import { PetFormData, PetProfile } from "../components/pet-profile/models/pet-profile.model"

export const PET_TEST_FORM_DATA: PetFormData[] = [
    {
        species: 'cat',
        name: 'Dodger',
        birthday: new Date(2014, 2, 14),
        weight: 17.5,
        weight_unit: 'lb',
        allergies: "",
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

export const PETS_TEST_DATA: PetProfile[] = [
    {
        id: 0,
        icon: 'dodger.png',
        ...PET_TEST_FORM_DATA[0]
    }
]

// export const PETS_TEST_DATA = [
//     {
//         "id": 0,
//         "species": "cat",
//         "name": "Dodger",
//         "icon": "dodger.png",
//         "birthday": "2024-12-14T00:00:00.000Z",
//         "weight": 17.5,
//         "weight_unit": "lb",
//         "allergies": "",
//         "medications": [
//             {
//                 "med_id": 0,
//                 "med_name": "Atopica",
//                 "directions": "1 pill / day"
//             }
//         ],
//         "goal": "Lose",
//         "target_weight": 16,
//         "factor": 0.8,
//         "daily_calories": 264.8,
//         "notes": "He is shy first but once he knows you, he loves hanging out and snuggle with them."
//     }
// ]





