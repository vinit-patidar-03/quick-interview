"use client";
import React, { useState, useEffect } from "react";
import { Filter, ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";

interface FilterSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

interface FilterOptionProps {
  label: string;
  count?: number;
  isSelected: boolean;
  onClick: () => void;
}

interface Company {
  name: string;
  logo: string;
  focus: string;
}

interface CompanyFilterProps {
  companies: Company[];
  selectedCompany: string;
  onCompanySelect: (company: string) => void;
}

interface SidebarProps {
  filters: {
    jobRole: string;
    difficulty: string;
    technology: string;
    duration: string;
    rating: string;
    company: string;
  };
  onFilterChange: (filterKey: string, value: string) => void;
}

interface Filters {
  roles: Set<string>;
  difficulties: Set<string>;
  technologies: Set<string>;
  durations: Set<string>;
  company: string;
}

const companies = [
  { name: "Google", logo: "🔍", focus: "Search & AI" },
  { name: "Microsoft", logo: "🪟", focus: "Software & Cloud" },
  { name: "Amazon", logo: "📦", focus: "E-commerce & Cloud" },
  { name: "Meta", logo: "👤", focus: "Social & VR" },
  { name: "Apple", logo: "🍎", focus: "Hardware & Software" },
];

const filterOptions = {
  roles: [
    { label: "Software Engineer", count: 45 },
    { label: "Full Stack Developer", count: 32 },
    { label: "Backend Engineer", count: 28 },
    { label: "Frontend Developer", count: 23 },
  ],
  difficulties: [
    { label: "Beginner", count: 67 },
    { label: "Intermediate", count: 89 },
    { label: "Expert", count: 34 },
  ],
  durations: [
    { label: "Under 30 mins", value: "short", count: 45 },
    { label: "30-60 mins", value: "medium", count: 78 },
    { label: "Over 60 mins", value: "long", count: 23 },
  ],
  technologies: [
    { label: "JavaScript", count: 89 },
    { label: "Python", count: 67 },
    { label: "Java", count: 56 },
    { label: "React", count: 78 },
  ],
};

const FilterSection = ({
  title,
  children,
  defaultOpen = true,
}: FilterSectionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b last:border-0 pb-4 last:pb-0">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between p-0 h-auto font-medium hover:bg-transparent cursor-pointer"
      >
        <span className="text-sm font-medium">{title}</span>
        {isOpen ? (
          <ChevronDown className="w-4 h-4" />
        ) : (
          <ChevronRight className="w-4 h-4" />
        )}
      </div>
      {isOpen && <div className="mt-3 space-y-2">{children}</div>}
    </div>
  );
};

const FilterOption = ({
  label,
  count,
  isSelected,
  onClick,
}: FilterOptionProps) => (
  <div className="flex items-center justify-between py-1">
    <div className="flex items-center space-x-2">
      <Checkbox id={label} checked={isSelected} onCheckedChange={onClick} />
      <label htmlFor={label} className="text-sm cursor-pointer">
        {label}
      </label>
    </div>
    {count && <span className="text-xs text-muted-foreground">({count})</span>}
  </div>
);

const CompanyFilter = ({
  companies,
  selectedCompany,
  onCompanySelect,
}: CompanyFilterProps) => (
  <div className="space-y-2">
    {companies.map((company) => (
      <Card
        key={company.name}
        className={`cursor-pointer transition-colors hover:bg-accent ${
          selectedCompany === company.name ? "border-primary bg-accent" : ""
        }`}
        onClick={() =>
          onCompanySelect(
            company.name === selectedCompany ? "all" : company.name
          )
        }
      >
        <CardContent className="p-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">{company.logo}</span>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">{company.name}</div>
              <div className="text-xs text-muted-foreground truncate">
                {company.focus}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);

const Sidebar = ({ filters, onFilterChange }: SidebarProps) => {
  const [selectedFilters, setSelectedFilters] = useState<Filters>({
    roles: new Set(filters.jobRole !== "all" ? [filters.jobRole] : []),
    difficulties: new Set(
      filters.difficulty !== "all" ? [filters.difficulty] : []
    ),
    technologies: new Set(
      filters.technology !== "all" ? [filters.technology] : []
    ),
    durations: new Set(filters.duration !== "all" ? [filters.duration] : []),
    company: filters.company,
  });

  // Sync selectedFilters with filters prop when it changes
  useEffect(() => {
    setSelectedFilters({
      roles: new Set(filters.jobRole !== "all" ? [filters.jobRole] : []),
      difficulties: new Set(
        filters.difficulty !== "all" ? [filters.difficulty] : []
      ),
      technologies: new Set(
        filters.technology !== "all" ? [filters.technology] : []
      ),
      durations: new Set(filters.duration !== "all" ? [filters.duration] : []),
      company: filters.company,
    });
  }, [filters]);

  const handleFilterToggle = (
    category: keyof Omit<Filters, "company">,
    value: string
  ) => {
    const newFilters = { ...selectedFilters };

    // Map category names to filter keys
    const filterKeyMap = {
      roles: "jobRole",
      difficulties: "difficulty",
      technologies: "technology",
      durations: "duration",
    };

    const filterKey = filterKeyMap[category];

    if (newFilters[category].has(value)) {
      newFilters[category].delete(value);
      onFilterChange(filterKey, "all");
    } else {
      // Clear other selections in the same category
      newFilters[category].clear();
      newFilters[category].add(value);
      onFilterChange(filterKey, value);
    }
    setSelectedFilters(newFilters);
  };

  const handleCompanySelect = (company: string) => {
    setSelectedFilters((prev) => ({ ...prev, company }));
    onFilterChange("company", company);
  };

  return (
    <div className="w-64 bg-background border-r overflow-y-auto fixed top-16 left-0 h-[calc(100vh-4rem)] z-10">
      <div className="px-4">
        <div className="flex items-center justify-between mb-2 sticky top-0 bg-white py-4">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            <h2 className="text-lg font-semibold">Filters</h2>
            {Object.values(filters).some((filter) => filter !== "all") && (
              <div className="w-2 h-2 bg-primary rounded-full"></div>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedFilters({
                roles: new Set<string>(),
                difficulties: new Set<string>(),
                technologies: new Set<string>(),
                durations: new Set<string>(),
                company: "all",
              });
              onFilterChange("jobRole", "all");
              onFilterChange("difficulty", "all");
              onFilterChange("technology", "all");
              onFilterChange("duration", "all");
              onFilterChange("company", "all");
            }}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Clear All
          </Button>
        </div>

        <div className="space-y-6 py-2">
          <FilterSection title="Job Role" defaultOpen={true}>
            {filterOptions.roles.map(({ label, count }) => (
              <FilterOption
                key={label}
                label={label}
                count={count}
                isSelected={selectedFilters.roles.has(label)}
                onClick={() => handleFilterToggle("roles", label)}
              />
            ))}
          </FilterSection>

          <FilterSection title="Difficulty" defaultOpen={true}>
            {filterOptions.difficulties.map(({ label, count }) => (
              <FilterOption
                key={label}
                label={label}
                count={count}
                isSelected={selectedFilters.difficulties.has(label)}
                onClick={() => handleFilterToggle("difficulties", label)}
              />
            ))}
          </FilterSection>

          <FilterSection title="Duration" defaultOpen={false}>
            {filterOptions.durations.map(({ label, value, count }) => (
              <FilterOption
                key={value}
                label={label}
                count={count}
                isSelected={selectedFilters.durations.has(value)}
                onClick={() => handleFilterToggle("durations", value)}
              />
            ))}
          </FilterSection>

          <FilterSection title="Technologies" defaultOpen={false}>
            {filterOptions.technologies.map(({ label, count }) => (
              <FilterOption
                key={label}
                label={label}
                count={count}
                isSelected={selectedFilters.technologies.has(label)}
                onClick={() => handleFilterToggle("technologies", label)}
              />
            ))}
          </FilterSection>

          <FilterSection title="Companies" defaultOpen={false}>
            <CompanyFilter
              companies={companies}
              selectedCompany={selectedFilters.company}
              onCompanySelect={handleCompanySelect}
            />
          </FilterSection>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
