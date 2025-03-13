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
    med_id: number,
    med_name: string,
    directions: string
}

export interface Pet_Form_DATA {
    id: number | null,
    type: 'cat' | 'dog' | null,
    name: string,
    birthday: Date | null,
    medications: PET_FORM_Medication[],
    goal: 'Maintain' | 'Gain' | 'Reduce',
    factor: number,
} 

interface PET_FORM_Medication {
    med_id: number | null,
    med_name: string,
    directions: string
}