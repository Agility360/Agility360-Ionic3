
export interface Candidate {
  candidate_id: number;
  account_name: string;
  email: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  city: string;
  state: string;
  phone_number: string;
  job_hunting: boolean;
  industry_id: number;
  industry: string;
  subindustry_id: number;
  subindustry: string;
  profession_id: number;
  profession: string;
  subprofession_id: number;
  subprofession: string;
  update_date: string;
  create_date: string;
  resume_filename: string;
}
