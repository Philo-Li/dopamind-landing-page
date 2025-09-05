import fs from 'fs';
import path from 'path';

export interface ChangelogVersion {
  version: string;
  title: string;
  date: string;
  emoji: string;
  features: string[];
}

export interface ChangelogData {
  title: string;
  description: string;
  versions: ChangelogVersion[];
}

const parseMarkdownChangelog = (content: string): ChangelogData => {
  const lines = content.split('\n');
  
  let title = '';
  let description = '';
  const versions: ChangelogVersion[] = [];
  
  let currentVersion: Partial<ChangelogVersion> = {};
  let currentFeatures: string[] = [];
  let inFeatures = false;
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    
    // Extract main title
    if (trimmedLine.startsWith('# ') && !title) {
      title = trimmedLine.substring(2);
      continue;
    }
    
    // Extract description (first paragraph after title)
    if (!description && trimmedLine && !trimmedLine.startsWith('#') && !trimmedLine.startsWith('##')) {
      description = trimmedLine;
      continue;
    }
    
    // Extract version headers (## v1.6.3...)
    if (trimmedLine.startsWith('## v')) {
      // Save previous version if exists
      if (currentVersion.version && currentVersion.title) {
        versions.push({
          ...currentVersion,
          features: currentFeatures,
        } as ChangelogVersion);
      }
      
      // Parse version line: ## v1.6.3 (2025-09-05) - Latest
      const versionMatch = trimmedLine.match(/^## (v[\d.]+)\s+\(([^)]+)\)(?:\s*-\s*(.*))?/);
      if (versionMatch) {
        currentVersion = {
          version: versionMatch[1],
          date: versionMatch[2],
          title: '', // Will be filled by the next ### line
          emoji: '',
          features: [],
        };
        currentFeatures = [];
        inFeatures = false;
      }
      continue;
    }
    
    // Extract version title (### 🚀 Title...)
    if (trimmedLine.startsWith('### ') && currentVersion.version) {
      const titleMatch = trimmedLine.match(/^### (.+)/);
      if (titleMatch) {
        const fullTitle = titleMatch[1];
        // Extract emoji and title
        const emojiMatch = fullTitle.match(/^(\S+)\s+(.+)/);
        if (emojiMatch) {
          currentVersion.emoji = emojiMatch[1];
          currentVersion.title = emojiMatch[2];
        } else {
          currentVersion.emoji = '📱';
          currentVersion.title = fullTitle;
        }
      }
      inFeatures = true;
      continue;
    }
    
    // Extract features (bullet points)
    if (inFeatures && trimmedLine.startsWith('• ')) {
      currentFeatures.push(trimmedLine.substring(2));
      continue;
    }
    
    // Stop collecting features when we hit a separator or empty line after features
    if (inFeatures && (trimmedLine === '---' || (trimmedLine === '' && currentFeatures.length > 0))) {
      inFeatures = false;
    }
  }
  
  // Add the last version
  if (currentVersion.version && currentVersion.title) {
    versions.push({
      ...currentVersion,
      features: currentFeatures,
    } as ChangelogVersion);
  }
  
  return {
    title,
    description,
    versions,
  };
};

export const getChangelog = (locale: string): ChangelogData => {
  try {
    const changelogPath = path.join(process.cwd(), 'changelogs', `${locale}.md`);
    
    if (!fs.existsSync(changelogPath)) {
      // Fallback to English if the requested locale doesn't exist
      const fallbackPath = path.join(process.cwd(), 'changelogs', 'en.md');
      if (fs.existsSync(fallbackPath)) {
        const content = fs.readFileSync(fallbackPath, 'utf8');
        return parseMarkdownChangelog(content);
      }
      
      // Return empty changelog if no files exist
      return {
        title: 'Changelog',
        description: 'Release notes and updates',
        versions: [],
      };
    }
    
    const content = fs.readFileSync(changelogPath, 'utf8');
    return parseMarkdownChangelog(content);
  } catch (error) {
    console.error('Error reading changelog:', error);
    return {
      title: 'Changelog',
      description: 'Release notes and updates',
      versions: [],
    };
  }
};