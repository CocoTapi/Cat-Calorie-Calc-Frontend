export interface Pet_Form_DATA {
    id: number | null,
    type: 'cat' | 'dog' | null,
    name: string,
    birthday: Date | null,

    weight: number | null,
    weight_unit: 'lb' | 'kg',

    allergies: string,
    medications: PET_FORM_Medication[],

    goal: 'Maintain' | 'Gain' | 'Lose',
    target_weight: number | null,

    factor: number,
    daily_calories: number | null,

    notes: string,
} 

interface PET_FORM_Medication {
    med_id: number | null,
    med_name: string,
    directions: string
}

export interface Pet_Profile extends Pet_Form_DATA {   
    icon: string,
}
