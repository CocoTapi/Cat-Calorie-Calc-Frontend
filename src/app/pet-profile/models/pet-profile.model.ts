export interface Pet_Profile {
    id: number,
    name: string,
    icon: string,
    birthday: Date,
    weight: number,
    weight_unit: 'lb' | 'kg',
    allergies: string,
    medications: Medication[],
    goal: 'maintain' | 'gain' | 'reduce',
    target_weight: number,
    factor: number,
    daily_calories: number,
    notes: string,
   
}

interface Medication {
    meds_name: string,
    directions: string
}