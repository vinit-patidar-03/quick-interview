import { Control, FieldValues, Path } from "react-hook-form";

export type ChildProp = {
  children: React.ReactNode;
}

export type User = {
    _id: string;
    username: string;
  email: string;
  profileImage?: string;
}

export type AuthFormType = "sign-in" | "sign-up";

export type AuthFormProps = {
  type: AuthFormType;
  error?: string;
  isLoading?: boolean;
}

export type FormFieldWithLabelProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  placeholder: string;
  label?: string;
  type?: "text" | "email" | "password";
}

export interface Question {
  question: string;
  type?: "conceptual" | "scenario";
  followups?: string[];
  hints?: string[];
}

export interface Interview {
  _id: string;
  userId?: string;
  company: string;
  role: string;
  technologies: string[];
  difficulty: Difficulty;
  duration: number;
  questions: Question[];
  description: string;
  companyLogo: string;
  createdAt?: Date;
  isBookmarked?: boolean;
  isCompleted?: boolean;
  isStarted?: boolean;
  isFeedback?:boolean
}

export interface PracticeInterviews{
  interview: Interview;
  createdAt: Date;
  updatedAt: Date;
  isStarted: boolean;
  isCompleted: boolean;
  _id: string;
  user: string;
}

export interface InterviewCardBrowseProps {
  interview: Interview;
  isBookmarked: boolean;
  onBookmarkToggle: (id: string) => void;
}

export interface InterviewCardPracticeProps {
  interview: Interview;
  isCompleted: boolean;
  isStarted: boolean
}

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterConfig {
  label: string;
  options: FilterOption[];
}

export interface FilterOptions {
  [key: string]: FilterConfig;
}

export interface FilterSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: FilterOption[];
  placeholder: string;
}

export interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
  sortOptions: FilterOption[];
}

export interface FilterSidebarProps {
  filters: { [key: string]: string };
  filterOptions: FilterOptions;
  onFilterChange: (key: string, value: string) => void;
  companies: Company[];
  onCompanyClick: (company: Company) => void;
}

export interface Tab {
  id: string;
  name: string;
  emoji: string;
}

export interface TabNavigationProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  tabs: Tab[];
}

export interface Company {
  name: string;
  logo: string;
  focus: string;
}

export interface CompanyCardProps {
  company: Company;
  onClick?: (company: Company) => void;
}

export interface DifficultyBadgeProps {
  difficulty: Interview["difficulty"];
}

export interface DurationBadgeProps {
  duration: number;
}

export interface StatusBadgesProps {
  trending: boolean;
  recentlyAdded: boolean;
}

export interface EmptyStateProps {
  title: string;
  description: string;
  icon?: string;
}

export type Difficulty =  "Beginner" | "Intermediate" | "Advanced" | "Expert";

export interface GenerateQuestionsParams {
  company: string;
  role: string;
  difficulty: Difficulty;
  technologies: string[];
  duration: number;
  description: string;
  Resume?:File
}
export interface GenerateDescriptionParams {
  company: string;
  role: string;
  difficulty: string;
  technologies: string[];
}