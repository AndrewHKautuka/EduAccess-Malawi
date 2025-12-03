import { SchoolCoverageMap } from '@/modules/school-accessibility/components/school-coverage-map';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'School Accessibility Analysis',
  description: 'Analyze school coverage and identify unserved communities',
};

export default function AccessibilityPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">School Accessibility Analysis</h2>
          <p className="text-muted-foreground">
            Visualize school coverage areas and identify communities without access
          </p>
        </div>
      </div>
      
      <div className="space-y-4">
        <SchoolCoverageMap />
      </div>
    </div>
  );
}
