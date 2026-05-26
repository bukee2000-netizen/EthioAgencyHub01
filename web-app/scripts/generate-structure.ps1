$routes = @(
  @{ Path='app\(auth)\register\page.tsx'; Title='Register Agency User'; Description='Create a new agency user with role-based access controls.'; Workflows='Invite user|Assign agency|Choose role|Send credentials' },
  @{ Path='app\(dashboard)\dashboard\trends\page.tsx'; Title='Dashboard Trends'; Description='Track agency performance trends across registration, documents, and travel.'; Workflows='Registration trends|Document throughput|Travel readiness|Agency comparison' },
  @{ Path='app\(dashboard)\dashboard\tasks\page.tsx'; Title='Dashboard Tasks'; Description='Manage priority operational tasks and follow-ups.'; Workflows='Pending approvals|Document reminders|Travel checklist|Agent follow-up' },
  @{ Path='app\(dashboard)\dashboard\activities\page.tsx'; Title='Dashboard Activities'; Description='Review audit-ready activity across the agency workspace.'; Workflows='Recent uploads|Status changes|Login events|Telegram updates' },
  @{ Path='app\(dashboard)\employee-management\registration\personal\page.tsx'; Title='Personal Registration'; Description='Capture employee identity and contact information.'; Workflows='Basic details|Contact information|Emergency contact|Agency assignment' },
  @{ Path='app\(dashboard)\employee-management\registration\skills\page.tsx'; Title='Skills Registration'; Description='Record skills, experience, language ability, and job preferences.'; Workflows='Skills profile|Experience history|Language level|Destination preference' },
  @{ Path='app\(dashboard)\employee-management\registration\review\page.tsx'; Title='Registration Review'; Description='Review employee registration before final submission.'; Workflows='Data validation|Document checklist|Interview status|Submit employee' },
  @{ Path='app\(dashboard)\employee-management\cv-generator\templates\page.tsx'; Title='CV Templates'; Description='Choose agency-branded CV templates for employee profiles.'; Workflows='Template library|Brand settings|Language variants|Preview template' },
  @{ Path='app\(dashboard)\employee-management\cv-generator\preview\page.tsx'; Title='CV Preview'; Description='Preview generated employee CVs before export.'; Workflows='Profile preview|Skill highlights|Document summary|Partner view' },
  @{ Path='app\(dashboard)\employee-management\cv-generator\download-share\page.tsx'; Title='Download & Share CV'; Description='Export and share employee CVs securely.'; Workflows='PDF export|Partner sharing|Download history|Access control' },
  @{ Path='app\(dashboard)\employee-management\cv-database\employee-profiles\page.tsx'; Title='Employee Profiles'; Description='Browse searchable employee CV profile records.'; Workflows='Profile list|Status filters|Destination filters|Document readiness' },
  @{ Path='app\(dashboard)\employee-management\cv-database\skill-matching\page.tsx'; Title='Skill Matching'; Description='Match employees to deployment opportunities.'; Workflows='Skill filters|Opportunity matching|Readiness score|Partner shortlist' },
  @{ Path='app\(dashboard)\employee-management\cv-database\search\page.tsx'; Title='CV Search'; Description='Search employee CV data across agencies and skills.'; Workflows='Keyword search|Advanced filters|Saved searches|Export results' },
  @{ Path='app\(dashboard)\employee-management\[id]\page.tsx'; Title='Employee Profile'; Description='View employee lifecycle, documents, video, and travel records.'; Workflows='Profile summary|Document timeline|Interview video|Travel history' },
  @{ Path='app\(dashboard)\documents\upload\page.tsx'; Title='Document Upload'; Description='Upload employee documents into the Teledrive-backed archive.'; Workflows='Photo upload|Passport upload|PDF upload|Storage routing' },
  @{ Path='app\(dashboard)\documents\visa\page.tsx'; Title='Visa Tracking'; Description='Track visa application status and required documents.'; Workflows='Application status|Expiry dates|Embassy notes|Approval workflow' },
  @{ Path='app\(dashboard)\documents\mols\page.tsx'; Title='MOLS Integration'; Description='Manage Ministry of Labor processing and verification tasks.'; Workflows='Submission queue|Cross-match|Missing reports|Approval status' },
  @{ Path='app\(dashboard)\documents\missing-report\page.tsx'; Title='Missing Report'; Description='Prepare and track missing-person reports to MOLS.'; Workflows='Incident details|Agency notes|Submission status|Follow-up timeline' },
  @{ Path='app\(dashboard)\documents\cross-match\page.tsx'; Title='Document Cross-Match'; Description='Verify consistency across employee documents and MOLS records.'; Workflows='Identity checks|Passport checks|Visa checks|Mismatch report' },
  @{ Path='app\(dashboard)\documents\[id]\page.tsx'; Title='Document Detail'; Description='View document metadata, status, storage path, and audit trail.'; Workflows='Document preview|Verification status|Storage path|Audit trail' },
  @{ Path='app\(dashboard)\travel\schedule\page.tsx'; Title='Travel Schedule'; Description='Schedule employee departures and destination timelines.'; Workflows='Calendar view|Destination groups|Readiness filter|Flight planning' },
  @{ Path='app\(dashboard)\travel\ticket\page.tsx'; Title='Ticket Management'; Description='Track ticket bookings and flight details.'; Workflows='Ticket status|PNR records|Airline details|Cost tracking' },
  @{ Path='app\(dashboard)\travel\today\page.tsx'; Title='Today Departures'; Description='Monitor employees departing today.'; Workflows='Ready list|Missing checklist|Flight manifest|Departure notes' },
  @{ Path='app\(dashboard)\travel\departure\page.tsx'; Title='Departure Preparation'; Description='Complete pre-departure checklist and final readiness.'; Workflows='Checklist|Document pack|Orientation|Airport handoff' },
  @{ Path='app\(dashboard)\travel\[id]\page.tsx'; Title='Travel Detail'; Description='View travel record details and departure history.'; Workflows='Flight detail|Employee records|Ticket detail|Status timeline' },
  @{ Path='app\(dashboard)\hajj-umrah\pilgrim-detail\page.tsx'; Title='Pilgrim Detail'; Description='Manage pilgrim profile and travel requirements.'; Workflows='Pilgrim profile|Group assignment|Requirement status|Travel notes' },
  @{ Path='app\(dashboard)\hajj-umrah\requirements\page.tsx'; Title='Pilgrimage Requirements'; Description='Track religious travel requirements and compliance.'; Workflows='Vaccination|Passport|Permit|Group rules' },
  @{ Path='app\(dashboard)\hajj-umrah\documentation\page.tsx'; Title='Pilgrimage Documentation'; Description='Manage Hajj and Umrah document packages.'; Workflows='Document pack|Permit files|Medical docs|Submission status' },
  @{ Path='app\(dashboard)\hajj-umrah\[id]\page.tsx'; Title='Pilgrimage Record'; Description='View individual pilgrimage record and season timeline.'; Workflows='Season data|Group details|Documents|Travel status' },
  @{ Path='app\(dashboard)\institutions\institution-detail\page.tsx'; Title='Institution Detail'; Description='View institution profile, contacts, and collaboration history.'; Workflows='Profile|Contacts|Documents|Communication' },
  @{ Path='app\(dashboard)\institutions\partners\page.tsx'; Title='Institution Partners'; Description='Manage partner institutions and overseas employers.'; Workflows='Partner list|Country filters|Status|Agreements' },
  @{ Path='app\(dashboard)\institutions\collaboration\page.tsx'; Title='Institution Collaboration'; Description='Coordinate collaboration and secure document exchange.'; Workflows='Shared tasks|Messages|Document exchange|Approvals' },
  @{ Path='app\(dashboard)\institutions\[id]\page.tsx'; Title='Institution Record'; Description='View institution record and relationship timeline.'; Workflows='Profile|Partnership status|Documents|Activity' },
  @{ Path='app\(dashboard)\agents\agent-detail\page.tsx'; Title='Agent Detail'; Description='View agent profile, work queue, and commission readiness.'; Workflows='Profile|Assignments|Performance|Commission' },
  @{ Path='app\(dashboard)\agents\performance\page.tsx'; Title='Agent Performance'; Description='Analyze agent registrations, quality, and deployment outcomes.'; Workflows='KPI score|Registrations|Deployments|Quality checks' },
  @{ Path='app\(dashboard)\agents\onboarding\page.tsx'; Title='Agent Onboarding'; Description='Guide new agents through onboarding requirements.'; Workflows='Invite|Training|Documents|Activation' },
  @{ Path='app\(dashboard)\agents\training\page.tsx'; Title='Agent Training'; Description='Manage training content and completion tracking.'; Workflows='Training modules|Progress|Assessments|Certification' },
  @{ Path='app\(dashboard)\agents\support\page.tsx'; Title='Agent Support'; Description='Track agent support requests and resources.'; Workflows='Tickets|Resources|Escalations|Resolution' },
  @{ Path='app\(dashboard)\agents\[id]\page.tsx'; Title='Agent Record'; Description='View agent record and operational history.'; Workflows='Assignments|Performance|Training|Support' },
  @{ Path='app\(dashboard)\administration\users\page.tsx'; Title='User Administration'; Description='Manage users across agencies and roles.'; Workflows='User list|Invite user|Deactivate user|Agency assignment' },
  @{ Path='app\(dashboard)\administration\roles-permissions\page.tsx'; Title='Roles & Permissions'; Description='Configure RBAC permissions for agency operations.'; Workflows='Role matrix|Permission groups|Access review|Policy updates' },
  @{ Path='app\(dashboard)\administration\settings\page.tsx'; Title='System Settings'; Description='Configure agency and platform settings.'; Workflows='Agency profile|Storage settings|Telegram settings|Notification settings' },
  @{ Path='app\(dashboard)\administration\logs\page.tsx'; Title='System Logs'; Description='Review operational and system logs.'; Workflows='API logs|Auth logs|Upload logs|Integration logs' },
  @{ Path='app\(dashboard)\administration\audit\page.tsx'; Title='Audit Trail'; Description='Track sensitive changes for compliance.'; Workflows='User changes|Document changes|Role changes|Export audit' },
  @{ Path='app\(dashboard)\reporting-analytics\overview\page.tsx'; Title='Analytics Overview'; Description='View agency-wide and platform-wide performance analytics.'; Workflows='KPI overview|Trend charts|Agency comparison|Operational health' },
  @{ Path='app\(dashboard)\reporting-analytics\employee-reports\page.tsx'; Title='Employee Reports'; Description='Analyze employee registration and deployment performance.'; Workflows='Registration report|Deployment report|Status report|Skill report' },
  @{ Path='app\(dashboard)\reporting-analytics\document-reports\page.tsx'; Title='Document Reports'; Description='Analyze document processing and verification metrics.'; Workflows='Pipeline report|Missing docs|Expiry report|Cross-match report' },
  @{ Path='app\(dashboard)\reporting-analytics\financial-reports\page.tsx'; Title='Financial Reports'; Description='Track agency financial metrics and commissions.'; Workflows='Commission report|Cost report|Revenue report|Agent payout' },
  @{ Path='app\(dashboard)\reporting-analytics\export\page.tsx'; Title='Export Reports'; Description='Export analytics data to CSV and PDF.'; Workflows='CSV export|PDF export|Scheduled export|Export history' },
  @{ Path='app\(dashboard)\user-settings\page.tsx'; Title='User Settings'; Description='Manage personal account preferences.'; Workflows='Profile|Security|Notifications|Session settings' },
  @{ Path='app\(dashboard)\user-settings\profile\page.tsx'; Title='Profile Settings'; Description='Update user profile information.'; Workflows='Name|Email|Agency|Contact' },
  @{ Path='app\(dashboard)\user-settings\security\page.tsx'; Title='Security Settings'; Description='Manage password, sessions, and MFA readiness.'; Workflows='Password|Sessions|MFA setup|Security log' },
  @{ Path='app\(dashboard)\user-settings\notifications\page.tsx'; Title='Notification Settings'; Description='Configure operational notification preferences.'; Workflows='Email alerts|Document alerts|Travel alerts|System alerts' }
)

foreach ($route in $routes) {
  if (Test-Path $route.Path) { continue }
  New-Item -ItemType Directory -Force -Path (Split-Path $route.Path) | Out-Null
  $items = ($route.Workflows -split '\|') | ForEach-Object { "'$_'" }
  $content = @"
import { ModulePage } from '@/components/module-page';

export default function Page() {
  return (
    <ModulePage
      title="$($route.Title)"
      description="$($route.Description)"
      workflows={[$($items -join ', ')]}
      actions={[{ label: 'Open workflow', href: '#' }]}
    />
  );
}
"@
  [System.IO.File]::WriteAllText((Resolve-Path -LiteralPath (Split-Path $route.Path)).Path + [System.IO.Path]::DirectorySeparatorChar + (Split-Path $route.Path -Leaf), $content, [System.Text.UTF8Encoding]::new($false))
}
