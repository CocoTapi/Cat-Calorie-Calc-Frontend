import { PetFormData } from "./components/pet-profile/models/pet-profile.model";

export abstract class CommonConstants {
    // Panel Id
    static readonly PET_FORM: string = 'petProfile';


    // PET_FORM_DATA
    static readonly PET_ID: string = 'id';
    static readonly SPECIES: string = 'species';
    static readonly NAME: string = 'name';
    static readonly BIRTHDAY: string = 'birthday';

    static readonly WEIGHT: string = 'weight';
    static readonly WEIGHT_UNIT: string = 'weight_unit';

    static readonly ALLERGIES: string = 'allergies';
    static readonly MEDICATIONS: string = 'medications';

    static readonly GOAL: string = 'goal';
    static readonly TARGET_WEIGHT: string = 'target_weight';

    static readonly FACTOR: string = 'factor';
    static readonly DAILY_CALORIES: string = 'daily_calories';

    static readonly NOTE: string = 'notes';


    // PET_FORM_Medication
    static readonly MED_ID: string = 'med_id';
    static readonly MED_NAME: string = 'med_name';
    static readonly DIRECTIONS: string = 'directions';

    // Pet_Profile
    static readonly ICON: string = 'icon';

    // Species Type
    static readonly CAT: string = 'cat';
    static readonly DOG: string = 'dog';

    // Weight Unit
    static readonly LB: string = 'lb';
    static readonly KG: string = 'kg';

    // Goal Selection value
    static readonly MAINTAIN: string = 'Maintain';
    static readonly LOSE: string = 'Lose';
    static readonly GAIN: string = 'Gain';

    // Language Translate 
    static readonly LANGUAGE_FILE_PATH: string = '/i18n/';
    static readonly LANGUAGE_FILE_EXTENSION: string = '.json';

    // Language tyoe 
    static readonly EN: string = 'en';
    static readonly JP: string = 'jp';



}

export const UNIT_TYPES = {
    WEIGHT_UNITS: {
        LB: 'lb',
        KG: 'kg',
    },
}

export const PET_DEFAULT: PetFormData = {
  species: 'cat',
  name: '',
  birthday: new Date(),

  weight: 0,
  weight_unit: 'kg',

  allergies: '',
  medications: [],

  goal: 'Maintain',
  target_weight: 0,

  factor: 1,
  daily_calories: 0,

  notes: ''
};
