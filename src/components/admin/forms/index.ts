import { HeroForm } from './HeroForm';
import { TrustStripForm } from './TrustStripForm';
import { ComparisonTableForm } from './ComparisonTableForm';
import { CurriculumTimelineForm } from './CurriculumTimelineForm';
import { TracksFeesForm } from './TracksFeesForm';
import { LearningModesForm } from './LearningModesForm';
import { JobRolesForm } from './JobRolesForm';
import { SalaryStatsForm } from './SalaryStatsForm';
import { FAQAccordionForm } from './FAQAccordionForm';
import { CTABannerForm } from './CTABannerForm';

export const SectionFormRegistry: Record<string, React.ComponentType<any>> = {
    hero: HeroForm,
    trust_strip: TrustStripForm,
    comparison_table: ComparisonTableForm,
    curriculum_timeline: CurriculumTimelineForm,
    tracks_fees: TracksFeesForm,
    learning_modes: LearningModesForm,
    career_roles: JobRolesForm,
    salary_stats: SalaryStatsForm,
    faq_accordion: FAQAccordionForm,
    cta_banner: CTABannerForm,
};
