// Skill registry: single source of truth for ids, display names and icon ids.
export const SKILL_IDS = [
  'csharp', 'unity', 'xamarin', 'salesforce', 'angular', 'html', 'css', 'javascript',
  'typescript', 'nodejs', 'react', 'flutter', 'cplusplus', 'elasticsearch', 'react-native', 'rabbitmq',
] as const;
export type SkillId = (typeof SKILL_IDS)[number];

export const SKILLS: Record<SkillId, { name: string }> = {
  csharp: { name: 'C#' },
  unity: { name: 'Unity' },
  xamarin: { name: 'Xamarin' },
  salesforce: { name: 'Salesforce' },
  angular: { name: 'Angular' },
  html: { name: 'HTML' },
  css: { name: 'CSS' },
  javascript: { name: 'JavaScript' },
  typescript: { name: 'TypeScript' },
  nodejs: { name: 'NodeJS' },
  react: { name: 'React' },
  flutter: { name: 'Flutter' },
  cplusplus: { name: 'C/C++' },
  elasticsearch: { name: 'ElasticSearch' },
  'react-native': { name: 'React Native' },
  rabbitmq: { name: 'RabbitMQ' },
};
