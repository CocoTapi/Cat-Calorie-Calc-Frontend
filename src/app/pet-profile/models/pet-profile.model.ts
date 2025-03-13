export interface Pet_Profile {
    id: number,
    type: 'cat' | 'dog',
    name: string,
    icon: string,
    birthday: Date,
    weight: number,
    weight_unit: 'lb' | 'kg',
    allergies: string | null,
    medications: Medication[] | null,
    goal: 'Maintain' | 'Gain' | 'Reduce',
    target_weight: number | null,
    factor: number,
    daily_calories: number,
    notes: string,
   
}

interface Medication {
    meds_id: number,
    meds_name: string,
    directions: string
}