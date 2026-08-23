// Skill registry: single source of truth for ids, display names and icon ids.
export const SKILL_IDS = [
  'csharp',
  'unity',
  'xamarin',
  'salesforce',
  'angular',
  'html',
  'css',
  'javascript',
  'typescript',
  'nodejs',
  'react',
  'flutter',
  'cplusplus',
  'elasticsearch',
  'react-native',
  'rabbitmq',
] as const;

export type SkillId = (typeof SKILL_IDS)[number];

export type Skill = { name: string; icon: string };

export const SKILLS = {
  csharp: { name: 'C#', icon: 'csharp' },
  unity: { name: 'Unity', icon: 'unity' },
  xamarin: { name: 'Xamarin', icon: 'xamarin' },
  salesforce: { name: 'Salesforce', icon: 'salesforce' },
  angular: { name: 'Angular', icon: 'angular' },
  html: { name: 'HTML', icon: 'html5' },
  css: { name: 'CSS', icon: 'css3' },
  javascript: { name: 'JavaScript', icon: 'js' },
  typescript: { name: 'TypeScript', icon: 'typescript' },
  nodejs: { name: 'NodeJS', icon: 'node' },
  react: { name: 'React', icon: 'react' },
  flutter: { name: 'Flutter', icon: 'flutter' },
  cplusplus: { name: 'C/C++', icon: 'cplusplus' },
  elasticsearch: { name: 'ElasticSearch', icon: 'elasticsearch' },
  'react-native': { name: 'React Native', icon: 'reactnative' },
  rabbitmq: { name: 'RabbitMQ', icon: 'rabbitmq' },
} as const satisfies Record<SkillId, Skill>;
